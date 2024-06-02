import { EvenBetterAPI } from "@bebiks/evenbetter-api";
import { Caido } from "@caido/sdk-frontend";
import "./index.css";
import {
  InputType,
  SettingsPageOptions,
} from "@bebiks/evenbetter-api/src/templates/settingsPage/types";

export const init = (caido: Caido) => {
  // Initialize EvenBetterAPI
  const evenBetterAPI = new EvenBetterAPI(caido, {
    manifestID: "evenbetter-sampleplugin",
    name: "EvenBetter: Sample Plugin",
  });

  customPromptCommand(caido, evenBetterAPI);
  examplePage(caido, evenBetterAPI);
  tablePage(caido, evenBetterAPI);
};

const customPromptCommand = (caido: Caido, evenBetterAPI: EvenBetterAPI) => {
  // Register and add to command palette command "Hello World"
  caido.commands.register("eb-sample:hello-world", {
    name: "Hello World",
    group: "EvenBetter: Sample Plugin",
    run: (context) => {},
  });
  caido.commandPalette.register("eb-sample:hello-world");

  // Create a prompt command "Hello World"
  evenBetterAPI.promptCommands.createPromptCommand(
    "Hello World",
    "What's your name?",
    (name) => {
      evenBetterAPI.toast.showToast({
        message: `Hello, ${name}!`,
        type: "info",
      });
    }
  );
};

let counter = 0;
const createNavigationBar = (caido: Caido, evenBetterAPI: EvenBetterAPI) => {
  const helloWorldButton = caido.ui.button({
    label: "Click me!",
    size: "small",
    variant: "primary",
  });

  helloWorldButton.addEventListener("mousedown", () => {
    counter++;
    evenBetterAPI.toast.showToast({
      message: `You clicked the button ${counter} times!`,
      type: "info",
    });
  });

  return evenBetterAPI.components.createNavigationBar({
    title: "Example",
    
    items: [
      {
        sidebarItemName: "Example",
        title: "Hello World",
        url: "#/example",
        onOpen: () => {},
      },
      {
        sidebarItemName: "Example",
        title: "Table",
        url: "#/example/table",
        onOpen: () => {},
      },
    ],
    customButtons: [helloWorldButton],
  });
};

const examplePage = (caido: Caido, evenBetterAPI: EvenBetterAPI) => {
  const container = document.createElement("div") as HTMLDivElement;

  const navigationBar = createNavigationBar(caido, evenBetterAPI);
  container.appendChild(navigationBar);

  const options: SettingsPageOptions = {
    title: "EvenBetter: Sample Plugin",
    description: "Configure EvenBetter: Sample Plugin settings.",
    inputGroups: [
      {
        width: "50%",
        groupName: "Extensions",
        groupDescription: "Configure extensions settings.",
        separateWithLine: true,
        inputs: [
          {
            type: InputType.CHECKBOX,
            labelAsHTML: true,
            label:
              "<b>Auto-update extensions:</b> Never miss an update - automatically update installed extensions when new versions are available.",
            id: "auto-updates",
          },
          {
            type: InputType.CHECKBOX,
            labelAsHTML: true,
            label:
              "<b>Enable notifications:</b> Get notified about new extensions, updates and more.",
            id: "notifications",
          },
        ],
      },
      {
        width: "fill-space",
        groupName: "EvenBetter: Sample Plugin",
        groupDescription: "Configure settings for EvenBetter: Sample Plugin.",
        separateWithLine: true,
        inputs: [
          {
            type: InputType.CHECKBOX,
            labelAsHTML: true,
            label:
              "<b>Show update notifications:</b> Get notified when new versions of EvenBetter: Sample Plugin are available.",
            id: "show-update-notifications",
          },
          {
            type: InputType.TEXT,
            labelAsHTML: true,
            label: "<b>URL to fetch extensions from:</b>",
            id: "extensions-url",
            defaultValue: "https://example.com",
          },
        ],
      },
    ],
  };

  const settingsPage = evenBetterAPI.templates.createSettingsPage(options);

  container.appendChild(settingsPage.render());

  caido.navigation.addPage("/example", {
    body: container,
  });

  caido.sidebar.registerItem("Example", "/example", {
    icon: "fas fa-code",
    group: "Sample Plugin",
  });
};

const tablePage = (caido: Caido, evenBetterAPI: EvenBetterAPI) => {
  const container = document.createElement("div") as HTMLDivElement;

  const navigationBar = createNavigationBar(caido, evenBetterAPI);
  container.appendChild(navigationBar);

  const table = evenBetterAPI.components.createTable({
    columns: [{ name: "Key" }, { name: "Value" }],
  });

  table.addRow([
    { columnName: "Key", value: "Hello" },
    { columnName: "Value", value: "World" },
  ]);

  table.addRow([
    { columnName: "Key", value: "Have a" },
    { columnName: "Value", value: "great day" },
  ]);

  table.addRow([
    { columnName: "Key", value: "Caido is" },
    { columnName: "Value", value: "awesome!" },
  ]);

  container.appendChild(table.getHTMLElement());

  caido.navigation.addPage("/example/table", {
    body: container,
  });
};
