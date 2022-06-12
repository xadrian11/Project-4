import React from 'react';
import { render } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('should render Loader component', () => {
    const { getByTestId } = render(<Loader />);
    const element = getByTestId('loader');
    expect(element).toBeVisible();
  });
});
