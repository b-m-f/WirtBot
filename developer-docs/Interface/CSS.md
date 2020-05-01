# Design spec

Global variables are coded in `src/styles/variables.scss`

These include things like:

- colors
- spacings
- mixins

# Structuring CSS

## Global styles

If the need to arises to apply a global style to the site, this has to be done in `src/styles/styles.scss`.
This includes things such as:

- Styling all `<a>`
- Styling all `input[type='number']`

## Styling components

Each component in the application should be scoped to its component and use `SASS`.
In the vue components this is done with the following `<styles>` section.

```vue
<styles lang="scss" scoped>
</styles>
```

What this does is allowing you to write `SASS` and access all the available global variables defined in `src/styles/variables.scss`.
In addition all the CSS rules that you write here will only apply to the component that you are in. Nothing will apply to other components.

This is a non-leaky approach, since no rules leak outside to other components - also called **scoped** rules, since they only apply to specific scope.
