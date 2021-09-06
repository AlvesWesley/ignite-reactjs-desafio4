import { Switch, Route } from "react-router-dom";

import { Dashboard } from "../pages/Dashboard";

export function Routes(): JSX.Element {
  return (
    <Switch>
      <Route path="/" exact component={Dashboard} />
    </Switch>
  );
}
