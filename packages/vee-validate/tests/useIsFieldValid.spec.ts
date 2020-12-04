import flushPromises from 'flush-promises';
import { useField, useIsFieldValid, useForm } from '@/vee-validate';
import { mountWithHoc, setValue } from './helpers';

describe('useIsFieldValid()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  const validate = (val: any) => (val ? true : REQUIRED_MESSAGE);

  test('returns the validity of a single field', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value } = useField('test', validate);
        const isValid = useIsFieldValid('test');

        return {
          value,
          isValid,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span>{{ isValid.toString() }}</span>
    `,
    });
    await flushPromises();

    const input = document.querySelector('input');
    const span = document.querySelector('span');
    setValue(input as any, '');
    await flushPromises();
    expect(span?.textContent).toBe('false');
    setValue(input as any, '12');
    await flushPromises();
    expect(span?.textContent).toBe('true');
  });

  test('returns the validity of array fields', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value } = useField('test', validate);
        useField('test', validate);
        const isValid = useIsFieldValid('test');

        return {
          value,
          isValid,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span>{{ isValid.toString() }}</span>
    `,
    });

    await flushPromises();
    const input = document.querySelector('input');
    const span = document.querySelector('span');
    setValue(input as any, '');
    await flushPromises();
    expect(span?.textContent).toBe('false');
    setValue(input as any, '12');
    await flushPromises();
    expect(span?.textContent).toBe('true');
  });

  test('returns undefined if field is not found', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const isValid = useIsFieldValid('test');

        return {
          isValid,
        };
      },
      template: `
      <span>{{ isValid }}</span>
    `,
    });

    await flushPromises();
    const span = document.querySelector('span');
    expect(span?.textContent).toBe('');
  });

  test('returns undefined if form is not found', async () => {
    mountWithHoc({
      setup() {
        const isValid = useIsFieldValid('test');

        return {
          isValid,
        };
      },
      template: `
      <span>{{ isValid }}</span>
    `,
    });

    await flushPromises();
    const span = document.querySelector('span');
    expect(span?.textContent).toBe('');
  });
});