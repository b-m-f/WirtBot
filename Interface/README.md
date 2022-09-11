# Interface

![Architecture diagram](Architecture_diagram.jpg)

The architecture of the Interface is intended to give clear roles to different parts. Responsibility for tasks should be easy to attribute to certain ares of the code.

## Configuration

You can set the following environment variables:

- **SSL_INTERFACE**: set to true to enable SSL for the interface. Keys are expected at `/interface/public_key` and `/interface/private_key`

## State

All the state that this application uses is defined and stored in the `src/store` directory.

This allows for a good overview of what is going on in the application and unifies the interface for changing things.

Refactoring becomes easier and inside of your components you do not have to worry about things like accessing data from other components - **everything has to go through the single store**.

[vuex](https://vuex.vuejs.org/) is used as the library to provide this functionality. If you want to change anything on the stores, you should familiarize yourself with the concepts.

## Styling


### Globals
Global **variables** are coded in `src/styles/variables.scss`

These include things like:

- colors
- spacings
- mixins

Global **styles** can be changed in `src/styles/styles.scss`.
This includes things such as:

- Styling all `<a>`
- Styling all `input[type='number']`

### Components

All styles in the application should be [scoped](https://vuejs.org/v2/style-guide/#Component-style-scoping-essential) to their respective component and use `SASS`.
In the vue components this is done with the following `<styles>` section.

```vue
<styles lang="scss" scoped>
</styles>
```

All the **global variables** will be available.

