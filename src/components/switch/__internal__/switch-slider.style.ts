import styled, { css } from "styled-components";

import SwitchSliderPanel from "./switch-slider-panel.style";
import StyledValidationIcon from "../../../__internal__/validations/validation-icon.style";
import { SwitchSliderProps } from "./switch-slider.component";
import baseTheme, { ThemeObject } from "../../../style/themes/base";

interface StyledSwitchSliderProps
  extends Pick<
    SwitchSliderProps,
    "checked" | "disabled" | "size" | "error" | "warning"
  > {
  isLoading?: boolean;
  theme?: Partial<ThemeObject>;
}

const StyledSwitchSlider = styled.div`
  ${({
    checked,
    isLoading,
    disabled,
    size,
    error,
    warning,
    theme,
  }: StyledSwitchSliderProps) => css`
    display: flex;
    font-size: 12px;
    font-weight: 500;
    height: 28px;
    left: 0;
    letter-spacing: 1px;
    position: relative;
    text-transform: uppercase;
    top: 0;
    width: 100%
    z-index: 2;
    border-radius: ${
      theme?.roundedCornersOptOut ? "90px" : "var(--borderRadius400)"
    };
    border-style: solid;
    border-color: var(--colorsActionMinor400);
    border-width: var(--borderWidth200);
    box-sizing: border-box;
    margin-top: ${size === "large" ? "-47px" : "-28px"};
    align-items: center;

    &::before {
      background-color: var(--colorsActionMinor400);
      bottom: 4px;
      content: "";
      height: ${size === "large" ? "var(--spacing400)" : "var(--spacing200)"};
      position: absolute;
      left: 4px;
      transition: margin-left 0.4s;
      width: ${size === "large" ? "var(--spacing400)" : "var(--spacing200)"};
      z-index: 1;
      border-radius: 50%;
    }

    ${
      checked &&
      css`
        background-color: var(--colorsActionMinor500);
        border-color: var(--colorsActionMinorTransparent);

        &::before {
          margin-left: calc(
            100% -
              ${size === "large" ? "var(--spacing500)" : "var(--spacing300)"}
          );
          background-color: var(--colorsActionMinorYang100);
        }
      `
    }

    ${
      disabled &&
      !isLoading &&
      css`
        border-color: var(--colorsActionDisabled600);

        &::before {
          background-color: var(--colorsActionDisabled600);
        }

        ${SwitchSliderPanel} {
          color: var(--colorsUtilityYin030);
        }

        ${checked &&
        css`
          background-color: var(--colorsActionDisabled500);
          border-color: var(--colorsActionMinorTransparent);

          &::before {
            background-color: var(--colorsActionMinorYang100);
          }

          ${SwitchSliderPanel} {
            color: var(--colorsUtilityYin030);
          }
        `}
      `
    }

    ${
      size === "large" &&
      css`
        ${theme?.roundedCornersOptOut ? "border-radius: 30px;" : ""}
      `
    }

    ${
      isLoading &&
      css`
        &::before {
          display: none;
        }
      `
    }

    ${
      warning &&
      !disabled &&
      css`
        border-color: var(--colorsSemanticCaution500);
      `
    }

    ${
      error &&
      !disabled &&
      css`
        border-color: var(--colorsSemanticNegative500);
      `
    }

    ${StyledValidationIcon} {
      position: absolute;
      right: -30px;
      height: 100%;
    }
  `}
`;

const HiddenContent = styled.div`
  ${({ size }: Pick<StyledSwitchSliderProps, "size">) => css`
    visibility: hidden;
    height: 0px;
    padding-left: ${size === "large"
      ? "var(--spacing700)"
      : "var(--spacing500)"};
  `}
`;

StyledSwitchSlider.defaultProps = {
  theme: baseTheme,
};

export { StyledSwitchSlider, HiddenContent };
export default StyledSwitchSlider;
