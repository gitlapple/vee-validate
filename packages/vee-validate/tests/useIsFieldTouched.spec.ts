import flushPromises from 'flush-promises';
import { useField, useForm, useIsFieldTouched } from '@/vee-validate';
import { dispatchEvent, mountWithHoc } from './helpers';

describe('useIsFieldTouched()', () => {
  test('gives access to a single field isTouched status', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, handleBlur } = useField('test');
        const isTouched = useIsFieldTouched('test');

        return {
          value,
          isTouched,
          handleBlur,
        };
      },
      template: `
      <input name="field" v-model="value" @blur="handleBlur" />
      <span>{{ isTouched.toString() }}</span>
    `,
    });
    await flushPromises();

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    dispatchEvent(input as any, 'blur');

    await flushPromises();
    expect(error?.textContent).toBe('true');
  });

  test('gives access to array fields isTouched status', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, handleBlur } = useField('test');
        useField('test');
        const isTouched = useIsFieldTouched('test');

        return {
          value,
          isTouched,
          handleBlur,
        };
      },
      template: `
      <input name="field" v-model="value" @blur="handleBlur" />
      <span>{{ isTouched.toString() }}</span>
    `,
    });
    await flushPromises();

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    dispatchEvent(input as any, 'blur');

    await flushPromises();
    expect(error?.textContent).toBe('true');
  });

  test('returns undefined if field does not exist', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const isTouched = useIsFieldTouched('something');

        return {
          isTouched,
        };
      },
      template: `
      <span>{{ isTouched }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('');
  });

  test('returns undefined if form does not exist', async () => {
    mountWithHoc({
      setup() {
        const isTouched = useIsFieldTouched('something');

        return {
          isTouched,
        };
      },
      template: `
      <span>{{ isTouched }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('');
  });
});