# Specification draft: Visual diff

## Using the Visual Diff in a Studio

In Studio context, a developer can import a component (`<VisualDiff>` in this example) which takes two versions of a document as props and renders a complete diff.

```
import VisualDiff from '@sanity/visual-diff'

render() {
  return <VisualDiff original={originalDocument} modified={modifiedDocument} />
}
```

The `<VisualDiff>` component does three things:

  1. Calls a resolver which determines which `summarizers` and `visualizers` are available in the Studio context, both from Sanity defaults, from the current Studio and via third-party plugins
  2. Calls a function (currently located in `bateson.ts`) which, based on the summarizers and the two document versions, creates a list of `change summaries` which describe the differences between the two documents. See "The Change Summary" below for more details.
  3. Renders a component which takes the change summaries and visualizers and produces a nice, humanly understandable, description of all the changes.

It should also be possible to pass styling and other useful UI options to the `<VisualDiff>` component.


## The Change Summary

### Let's start with an example

A document of type `zoo` has changed the value on key `keeper.age` from `7` to `8`. This diff would produce the following `change summary`:

```
{
  "operation": "edit",
  "path": [
    "keeper",
    "age"
  ],
  "field": "age",
  "from": 7,
  "to": 8
}
```

### Change Summary properties

A breakdown of the change summary properties:

- `operation` - Describes what type of change has occured. There are four standard kinds:
  - `edit` - A value has changed
  - `add` - A value has appeared where there was none
  - `remove` - A value has been removed
  - `replace` - The object type has changed
- `path` - An array of strings which when put together denotes the absolute path to a point in the JSON data structure where the change has occured. A `string` entry in this array signifies that an object or a primitive has changed. An `object` entry signifies that an array has been changed (the `_key: 'abc123'` key refers to which object, see example below)
- `field` - The name of the Sanity schema field where the change has occurred (the need for this property in still under consideration)
- `from` - The old value
- `to` - The new value


### Some more examples

The `zoo.location` has been set (where there previously was no value). This is what the change summary would look like:

```
{
  "operation": "add",
  "path": [
    "location"
  ],
  "field": "location",
  "to": {
    "_type": "geopoint",
    "lat": 58.63169011423141,
    "lng": 9.089101352587932,
    "alt": 13.37
  }
}
```

The `zoo.primates` array has lost one of its members:

```
{
  "operation": "remove",
  "path": [
    "primates",
    {"_key": "abc123"}
  ],
  "field": "primates",
  "from": {
    "_type": "primate",
    "_key": "abc123",
    "name": "Bob",
    "species": "Nomascus concolor",
  }
}
```

**Note**: The `path` array contains `{"_key": "abc123"}` which refers to the removed element. This pattern for denoting an object in an array wasn't "invented here", but is used other places as well, internally in the Studio source code.


## Custom Summarizers and Visualizers

A developer can implement the part `part:@sanity/visual-diff/custom` to define her own custom summarizers and visualizers. The implementation of this part should export summarizers and visualizers on separate keys, e.g.:

```
const summarizers = {
  // custom summarizers
}

const visualizers = {
  // custom visualizers
}

export default {
  summarizers,
  visualizers
}
```


## Summarizers

`Summarizers` produce `change summaries`. A summarizer's task is to describe a distinct change which has happened between the two documents. A summarizer is defined per schema type, and returns a `resolve` function which returns an array of one or more change summaries. A developer can implement `part:@sanity/visual-diff/custom` to define her own custom summarizers. E.g.:

```
const summarizers = {
  string: {
    resolve: (a, b, path) => {
      return {
        fields: [],
        changes: [
          {
            operation: 'editText',
            from: a,
            to: b
          }
        ]
      }
    }
  },

  image: {
    resolve: (a, b, path) => {
      const changes = []
      if (!a.asset && b.asset) {
        changes.push({operation: 'addImage', to: b.asset._ref})
      } else if (a.asset && !b.asset) {
        changes.push({operation: 'removeImage', from: a.asset._ref})
      } else if (a.asset && b.asset && a.asset._ref !== b.asset._ref) {
        changes.push({operation: 'replaceImage', from: a.asset._ref, to: b.asset._ref})
      }
      return changes.length ? {fields: ['asset'], changes} : null
    }
  }
}

export default {
  summarizers
}
```

The `resolve` function of a summarizer takes the parameters...
  - `a` - Original value
  - `b` - Modified value
  - `path` - An array of strings which when put together denotes the absolute path of where the change has occured (see the `path` array on change summary above)

...and returns an object with two keys:

- `changes` - An array of changes summaries (see above). These need not contain the `path` and `type` fields, as they will be automatically added by the internal diff logic.
- `fields` - An array of strings which name the fields this custom summarizer has handled. An empty array means "I've handle all fields" on this object. A `null` or `undefined` value means it has handled no fields. The internal diff logic will take responsibility for handling any _other_ fields _not_ handled by this summarizer.

**Note**: In the example above, the image summarizer returns `{fields: ['asset'], changes}`. This means the custom summarizer has handled the `asset` field, but any other fields on the same image object (e.g. `caption`) has not been handled.

If there are multiple summarizers defined for the same type, the last one wins. "Last" in this sense means the one defined latest in the `parts` array in the Studio's `sanity.json` file.

Thus, defining a summarizer for type `a` will supersede any other summarizers for type `a`, but won't affect the presence of a summarizer for type `b` defined elsewhere.


### Custom Visualizers

A developer can implement `part:@sanity/visual-diff/custom` to define custom `visualizers`. A Visualizer is defined per type _and_ operation. It's output is a user-friendly rendering of a particular change. An example could look like:

```
const visualizers = {
  string: {
    editText: {
      component: props => {
        const {operation, field, from, to} = props.item
        return (
          <div>{field} [{operation}] "{from}" --> "{to}"</div>
        )
      }
    }
  }
}

export default {
  visualizers
}
```

Defining a custom visualizer will supersede other visualizers for the same type _and_ operation. Defining a visualizer for type `image.replaceImage` won't affect the presence of a visualizer `image.addImage` defined elsewhere.


## There will be UI affordances to revert individual changes

Each change summary provides enough information to generate a "revert patch". A button in the UI will enable a Studio user to apply that patch.

If a developer has implemented a custom summarizer, we may not be unable to assemble the correct revert patch. It is a developers responsibility to:
  - Either: Ensure that the change summary is understandable by the internal logic (i.e. follows the above contract)
  - Or: The change summary includes it's own `revert` key wherein there's enough information to assemble a revert patch. E.g.:

```
{
  "operation": "replaceImage",
  "path": ["mainImage"],
  "field": "mainImage",
  "from": "image-ref-123",
  "to": "image-ref-456",
  "revert": {
    "operation": "edit",
    "path": ["mainImage", "asset", "_ref"],
    "from": "image-ref-123",
    "to": "image-ref-456"
  }
}
```

## There will be a "blame" feature, which renders user info, along side each change, for the person responsible

Hook up Mendoza to enable this 🐉

## There should be excellent docs on how to create custom summarizers/visualizers

`!important`


## Notes

- Visualizer should nest through the schema, and for each type check if there is a change summary for that particular field to be rendered
- Be sure to gracfully handle data which doesn't match the current schema? E.g. docA has a different (typically unmigrated data) structure than docB
- Should we support that a summarizer can return `fields: ['key.deeperKey']`?
- Make bateson apply `path` and `field` key to all change summaries after being produced by the summarizer
- On startup, when resolving all implemented summarizers and visualizers, console.log if there are overlapping implementations
