import { combineReducers, legacy_createStore as createStore } from 'redux';
import { projectReducer } from './projectReducer';
import { taskReducer } from './taskReducer';
import { commentReducer } from './commentReducer';

const rootReducer = combineReducers({
   project: projectReducer,
   task: taskReducer,
   comment: commentReducer,
});

type RootReduceType = typeof rootReducer;
export type AppStateType = ReturnType<RootReduceType>;

type PropsType<T> = T extends { [key: string]: infer U } ? U : never;

export type InferActionsType<T extends { [key: string]: (...args: any[]) => any }> = ReturnType<
   PropsType<T>
>;

const store = createStore(rootReducer);

export default store;
