import { mount } from "@vue/test-utils";
import TodoList from "@/components/TodoList.vue";

describe("TodoList", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(TodoList);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("renders correctly", () => {
    const wrapper = mount(TodoList);
    expect(wrapper.element).toMatchSnapshot();
  });
});
