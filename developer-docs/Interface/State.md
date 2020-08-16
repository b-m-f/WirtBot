# State

All the state that this application uses is defined and stored in the `src/store` directory.

This allows for a good overview of what is going on in the application and unifies the interface for changing things.
Refactoring becomes easier and inside of your components you do not have to worry about things like accessing data from other components - **eveything has to go through the store**.

[vuex](https://vuex.vuejs.org/) is used as the library to provide this functionality. If you want to change anything on the stores, you should familiarize yourself with the concepts.

It will be a bit complicated to understand what is going on at first, but you can always ask reach out on Github to ask for help if you are stuck.

Here are a few key ideas:

- Access the global state through the store using `computed` variables in your component
- For changing the state, dispatch an action with the correct data onto the store, this will tell it what to do ie. (`this.$store.dispatch(ACTION_NAME, DATA)`)
- Mutations are not supposed to be called directly, instead write a corresponding action that will take the data and then call the mutation via `commit(MUTATION_NAME)`
## Steps to check when modifying the store
- Will backups still work?  Make sure to use the versioning system to provide backup upgrades