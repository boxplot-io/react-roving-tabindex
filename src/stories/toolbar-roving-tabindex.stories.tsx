import React, { FC, useRef } from 'react';
import { Meta } from '@storybook/react/types-6-0';
import 'jspolyfill-array.prototype.findIndex';

import { KeyDirection, RovingTabIndexProvider, useRovingTabIndex } from '..';
import { Button } from './button';
import { Toolbar } from './toolbar';

type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

const ToolbarButton: FC<{
  disabled: boolean;
  id?: string;
  onClick: ButtonClickHandler;
}> = ({ disabled, id, children, onClick }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [tabIndex, handleKeyDown, handleClick] = useRovingTabIndex(ref, disabled);

  return (
    <Button
      ref={ref}
      id={id}
      onKeyDown={handleKeyDown}
      onClick={(event) => {
        handleClick();
        onClick(event);
      }}
      tabIndex={tabIndex}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

type ExampleProps = {
  direction: KeyDirection;
  buttonOneDisabled: boolean;
  onButtonOneClicked: ButtonClickHandler;
  buttonTwoDisabled: boolean;
  onButtonTwoClicked: ButtonClickHandler;
  buttonThreeDisabled: boolean;
  onButtonThreeClicked: ButtonClickHandler;
  buttonFourDisabled: boolean;
  onButtonFourClicked: ButtonClickHandler;
  buttonFiveDisabled: boolean;
  onButtonFiveClicked: ButtonClickHandler;
  removeButtonFour: boolean;
};

export const ToolbarExample: FC<ExampleProps> = ({
  direction,
  buttonOneDisabled,
  onButtonOneClicked,
  buttonTwoDisabled,
  onButtonTwoClicked,
  buttonThreeDisabled,
  onButtonThreeClicked,
  buttonFourDisabled,
  onButtonFourClicked,
  buttonFiveDisabled,
  onButtonFiveClicked,
  removeButtonFour,
}) => (
  <>
    <Button>Something before to focus on</Button>
    <Toolbar role="toolbar">
      <RovingTabIndexProvider direction={direction} initialTabElementSelector="#button-two">
        <span>
          <ToolbarButton disabled={!!buttonOneDisabled} onClick={onButtonOneClicked}>
            Button One
          </ToolbarButton>
        </span>
        <ToolbarButton disabled={!!buttonTwoDisabled} onClick={onButtonTwoClicked}>
          Button Two
        </ToolbarButton>
        <ToolbarButton disabled={!!buttonThreeDisabled} onClick={onButtonThreeClicked}>
          Button Three
        </ToolbarButton>
        {!removeButtonFour && (
          <span>
            <span>
              <ToolbarButton disabled={!!buttonFourDisabled} onClick={onButtonFourClicked}>
                Button Four
              </ToolbarButton>
            </span>
          </span>
        )}
        <ToolbarButton disabled={!!buttonFiveDisabled} onClick={onButtonFiveClicked}>
          Button Five
        </ToolbarButton>
      </RovingTabIndexProvider>
    </Toolbar>
    <Button>Something after to focus on</Button>
  </>
);

export const ToolbarWithInitialTabElementExample: FC<
  ExampleProps & {
    onTabElementSelected: (element: Element) => void;
  }
> = ({
  direction,
  buttonOneDisabled,
  onButtonOneClicked,
  buttonTwoDisabled,
  onButtonTwoClicked,
  buttonThreeDisabled,
  onButtonThreeClicked,
  buttonFourDisabled,
  onButtonFourClicked,
  buttonFiveDisabled,
  onButtonFiveClicked,
  removeButtonFour,
  onTabElementSelected,
}) => (
  <>
    <Button>Something before to focus on</Button>
    <Toolbar role="toolbar">
      <RovingTabIndexProvider
        direction={direction}
        initialTabElementSelector="#button-two"
        onTabElementSelected={onTabElementSelected}
      >
        <span>
          <ToolbarButton disabled={!!buttonOneDisabled} onClick={onButtonOneClicked}>
            Button One
          </ToolbarButton>
        </span>
        <ToolbarButton id="button-two" disabled={!!buttonTwoDisabled} onClick={onButtonTwoClicked}>
          Button Two *
        </ToolbarButton>
        <ToolbarButton disabled={!!buttonThreeDisabled} onClick={onButtonThreeClicked}>
          Button Three
        </ToolbarButton>
        {!removeButtonFour && (
          <span>
            <span>
              <ToolbarButton disabled={!!buttonFourDisabled} onClick={onButtonFourClicked}>
                Button Four
              </ToolbarButton>
            </span>
          </span>
        )}
        <ToolbarButton disabled={!!buttonFiveDisabled} onClick={onButtonFiveClicked}>
          Button Five
        </ToolbarButton>
      </RovingTabIndexProvider>
    </Toolbar>
    <Button>Something after to focus on</Button>
  </>
);

export default {
  title: 'Toolbar RovingTabIndex',
  component: ToolbarExample,
  argTypes: {
    direction: {
      name: 'Direction',
      defaultValue: 'horizontal',
    },
    onButtonOneClicked: { table: { disable: true } },
    onButtonTwoClicked: { table: { disable: true } },
    onButtonThreeClicked: { table: { disable: true } },
    onButtonFourClicked: { table: { disable: true } },
    onButtonFiveClicked: { table: { disable: true } },
    buttonOneDisabled: {
      name: 'Disable Button One',
    },
    buttonTwoDisabled: {
      name: 'Disable Button Two',
    },
    buttonThreeDisabled: {
      name: 'Disable Button Three',
      defaultValue: true,
    },
    buttonFourDisabled: {
      name: 'Disable Button Four',
    },
    buttonFiveDisabled: {
      name: 'Disable Button Five',
    },
    removeButtonFour: {
      name: 'Remove Button Four',
    },
    onTabElementSelected: { table: { disable: true } },
  },
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as Meta;
