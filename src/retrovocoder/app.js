import { AppBase } from "@hzbridge/appbase.js";
import { DemoScript } from "./demo.js";

export class App extends AppBase
{
  constructor()
  {
    super({DemoScript});
  }
}