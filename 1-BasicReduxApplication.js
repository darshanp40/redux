// Library code
function createStore(reducer) {
    /* 
        Redux is a predictable state container for JavaScript apps.
        - The State Tree
        - Getting the state - using getState
        - Listening for changes - using subscribe
        - Updating the state 

        ------------------------------------------------------------------------------------------------------
        Only an event can change the state of the store.
        Actions - When an event takes place in a Redux application, 
                    we use a plain JavaScript object to keep track of what the specific event was. 
                    This object is called an Action.
        ------------------------------------------------------------------------------------------------------
        State Tree <----> {action} {action} {action} {action}
        We need a function that would take the current state tree and action to be performed as parameter
        and return us a new state tree
        The function that returns the new state needs to be a pure function.
        Pure Functions:
        1. Always return the same result with the same arguments
        2. Depends solely on the arguments passed
        3. Do not produce any sideeffects
        Pure functions are predictable that is why we need pure functions for increasing state predictability
        ------------------------------------------------------------------------------------------------------
        State Tree <--Pure function - Reducer--> {action} {action} {action} {action}
        
        The new dispatch() method is pretty small, but is vital to our functioning store code. 
        To briefly recap how the method functions:

        1. dispatch() is called with an Action
        2. the reducer that was passed to createStore() is called with the current state tree and the action...
           this updates the state tree
        3. because the state has (potentially) changed, all listener functions that have been registered with
           the subscribe() method are called
        ------------------------------------------------------------------------------------------------------
        we created a function called createStore() that returns a store object
        createStore() must be passed a "reducer" function when invoked
        the store object has three methods on it:
        .getState() - used to get the current state from the store
        .subscribe() - used to provide a listener function the store will call when the state changes
        .dispatch() - used to make changes to the store's state
        the store object's methods have access to the state of the store via closure
        ------------------------------------------------------------------------------------------------------
        Root Reducer: Call an appropriate reducer from the list of reducer whenever an action is dispatched

    */
    let state;
    let listeners = [];
    const getState = () => state;
    const subscribe = (listener) => {
        listeners.push(listener);
        // return a method to unsubscribe the listener
        return () => {
            listeners = listeners.filter((l) => l !== listener)
        }
    }

    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach((listener) => listener())
    }
    return {
        getState,
        subscribe,
        dispatch
    };
}

// App Code
function todos (state = [], action) {
  switch(action.type) {
    case 'ADD_TODO' :
      return state.concat([action.todo])
    case 'REMOVE_TODO' :
      return state.filter((todo) => todo.id !== action.id)
    case 'TOGGLE_TODO' :
      return state.map((todo) => todo.id !== action.id ? todo :
        Object.assign({}, todo, { complete: !todo.complete }))
    default :
      return state
  }
}

function goals (state = [], action) {
  switch(action.type) {
    case 'ADD_GOAL' :
      return state.concat([action.goal])
    case 'REMOVE_GOAL' :
      return state.filter((goal) => goal.id !== action.id)
    default :
      return state
  }
}
// Root Reducer
function app(state={}, action) {
    return {
        todos: todos(state.todos, action),
        goals: goals(state.goals, action)
    }
}
const store = createStore(app)

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 0,
    name: 'Walk the dog',
    complete: false,
  }
})

store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 1,
    name: 'Wash the car',
    complete: false,
  }
})

store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 2,
    name: 'Go to the gym',
    complete: true,
  }
})

store.dispatch({
  type: 'REMOVE_TODO',
  id: 1
})

store.dispatch({
  type: 'TOGGLE_TODO',
  id: 0
})

store.dispatch({
  type: 'ADD_GOAL',
  goal: {
    id: 0,
    name: 'Learn Redux'
  }
})

store.dispatch({
  type: 'ADD_GOAL',
  goal: {
    id: 1,
    name: 'Lose 20 pounds'
  }
})

store.dispatch({
  type: 'REMOVE_GOAL',
  id: 0
})