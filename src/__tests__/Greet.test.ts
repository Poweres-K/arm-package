import { Greeter, Hi } from "../index";

test("My Greeter", () => {
  expect(Greeter("Carl")).toBe("Hello Carl");
});

test("My Hi", () => {
  expect(Hi("Carl")).toBe("Hi Carl");
});
