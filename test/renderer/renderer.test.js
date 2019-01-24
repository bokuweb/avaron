import test from "ava";
import React from "react";
import { readFileSync } from "fs";
import { render } from "react-dom";
import { screenshot, isAvaronRenderer, getCurrentWindow } from "../../";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import DatePickerDialog from "material-ui/DatePicker/DatePickerDialog";

let datePicker;

const Example = () => (
  <MuiThemeProvider>
    <DatePickerDialog
      ref={e => {
        datePicker = e;
      }}
      initialDate={new Date(2017, 4, 1)}
      firstDayOfWeek={0}
      mode="landscape"
    />
  </MuiThemeProvider>
);

test("should capture react component screenshot", async t => {
  render(<Example />, document.querySelector(".main"));
  datePicker.show();
  const path = "screenshots/should_capture_react_component_screenshot.png";
  await new Promise(resolve => setTimeout(() => resolve(), 200));
  await screenshot(path);
  try {
    const png = readFileSync(path);
    t.is(!!png, true);
  } catch (e) {
    console.error(e);
    t.fail();
  }
  t.is(!!document.querySelector, true);
});

test("should isAvaron return true", async t => {
  t.is(Boolean(isAvaronRenderer()), true);
});

test("should get currentWindow", async t => {
  const win = getCurrentWindow();
  t.is(Boolean(getCurrentWindow()), true);
});
