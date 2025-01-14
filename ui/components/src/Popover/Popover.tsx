import React, { FC } from 'react';
import TooltipTrigger from 'react-popper-tooltip';
import { get } from '@theme-ui/css';
import {
  TooltipTriggerProps,
  ChildrenArg,
} from 'react-popper-tooltip/dist/types';
import { ColorModesScale } from 'theme-ui';
import { Arrow, Wrapper } from './PopoverUtils';
import { useTheme } from '../ThemeContext';

export interface PopoverOwnProps {
  /**
   * set to false to hide the arrow
   */
  arrowVisible?: boolean;
}

export type PopoverProps = PopoverOwnProps &
  Omit<Partial<TooltipTriggerProps>, 'children'>;

/**
 * Popover container that is triggered by a click/hover event, using [react-popper-tooltip](https://github.com/mohsinulhaq/react-popper-tooltip).
 */
export const Popover: FC<PopoverProps> = ({
  arrowVisible = true,
  trigger,
  placement = 'bottom',
  modifiers,
  tooltip,
  children,
  tooltipShown,
  onVisibilityChange,
  ...rest
}) => {
  const borderColor = 'lightgrey';
  const theme = useTheme();
  return (
    <TooltipTrigger
      placement={placement}
      trigger={trigger}
      modifiers={modifiers}
      tooltipShown={tooltipShown}
      onVisibilityChange={onVisibilityChange}
      tooltip={tooltipProps => {
        const { getTooltipProps, getArrowProps, tooltipRef, arrowRef } =
          tooltipProps;
        const { hidden, ...containerProps } = getTooltipProps();
        return (
          <Wrapper
            placement={placement}
            borderColor={borderColor}
            hidden={hidden}
            ref={tooltipRef as any}
            style={{
              ...containerProps.style,
              backgroundColor: get(
                theme.colors as ColorModesScale,
                'background',
              ),
            }}
          >
            {arrowVisible && (
              <Arrow
                placement={placement}
                borderColor={borderColor}
                ref={arrowRef as any}
                style={{
                  ...getArrowProps().style,
                }}
              />
            )}
            {typeof tooltip === 'function' ? tooltip(tooltipProps) : tooltip}
          </Wrapper>
        );
      }}
    >
      {({ getTriggerProps, triggerRef }: ChildrenArg) => (
        <div
          ref={triggerRef as any}
          {...getTriggerProps()}
          style={{ display: 'inline-block' }}
          {...rest}
        >
          {children}
        </div>
      )}
    </TooltipTrigger>
  );
};
