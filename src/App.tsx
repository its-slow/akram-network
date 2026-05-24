import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import NetworkApp from "@/pages/NetworkApp";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <WouterRouter base={basePath}>
      <Switch>
        <Route path="/" component={NetworkApp} />
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
      <Toaster position="top-center" richColors />
    </WouterRouter>
  );
}