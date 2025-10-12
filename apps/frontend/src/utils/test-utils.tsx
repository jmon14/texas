// React
import { FC, PropsWithChildren, ReactElement } from 'react';

// External libraries
import { render, RenderOptions } from '@testing-library/react';
import { FieldValues, useForm } from 'react-hook-form';
import { PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// Store
import { AppStore, RootState, setupStore } from '../store/store';

// Entities
import { UserEntity } from '../../backend-api/api';

// Utils
import { WithFormProps } from './form-utils';

// Custom render options
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) => {
  const Wrapper = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
    return <Provider store={store}>{children}</Provider>;
  };

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const withForm = <TControls extends FieldValues, P extends WithFormProps<TControls>>(
  Component: FC<P>,
) => {
  const displayName = Component.displayName || Component.name || 'Component';

  const ComponentWithForm = (
    props: Omit<P, keyof Omit<WithFormProps<TControls>, 'name' | 'initialValue' | 'validation'>>,
  ) => {
    const {
      formState: { errors },
      register,
      getValues,
    } = useForm<TControls>({
      mode: 'onBlur',
    });
    return (
      <Component {...(props as P)} getValues={getValues} register={register} errors={errors} />
    );
  };

  ComponentWithForm.displayName = `withForm(${displayName})`;

  return ComponentWithForm;
};

// Mocks
export const mockUser: UserEntity = {
  email: 'test@test.com',
  username: 'Test',
  active: true,
  uuid: '',
};
