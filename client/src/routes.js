import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import ShoppingListApp from "./components/ShoppingListApp/ShoppingListApp"
import ShoppingListIntroduction from "./components/ShoppingListIntroduction/ShoppingListIntroduction"

export const routes = (
  <Switch>
    <Route exact path="/intro" component={ShoppingListIntroduction} />
    <Route path="/app/:id" render={({ match }) => <ShoppingListApp match={match} />} />
    <Redirect to="/intro" />
  </Switch>
)
