import React, { useEffect, useMemo, useRef } from "react";
import DayPicker, {
  DayPickerProps,
  DayModifiers,
  Modifier,
  LocaleUtils,
} from "react-day-picker";
import { flip, offset } from "@floating-ui/dom";

import { getDisabledDays } from "../utils";
import Popover from "../../../../__internal__/popover";
import useLocale from "../../../../hooks/__internal__/useLocale";
import Navbar from "../navbar";
import Weekday from "../weekday";
import StyledDayPicker from "./day-picker.style";

type CustomRefObject<T> = {
  current?: T | null;
};

/** there is an issue with typescript-to-proptypes package that means we need to override these types */
interface Modifiers {
  today: NonNullable<Modifier> | NonNullable<Modifier>[];
  outside: NonNullable<Modifier> | NonNullable<Modifier>[];
  [other: string]: NonNullable<Modifier> | NonNullable<Modifier>[];
}

export interface PickerProps
  extends Omit<DayPickerProps, "disabledDays" | "modifiers" | "selectedDays"> {
  disabledDays?: NonNullable<Modifier> | NonNullable<Modifier>[] | undefined[];
  modifiers?: Partial<Modifiers>;
  selectedDays?: NonNullable<Modifier> | NonNullable<Modifier>[] | undefined[];
}

export interface DatePickerProps {
  /** Boolean to toggle where DatePicker is rendered in relation to the Date Input */
  disablePortal?: boolean;
  /** Minimum possible date YYYY-MM-DD */
  minDate?: string;
  /** Maximum possible date YYYY-MM-DD */
  maxDate?: string;
  /** Pass any props that match the DayPickerProps interface to override default behaviors */
  pickerProps?: PickerProps;
  /** Element that the DatePicker will be displayed under */
  inputElement: CustomRefObject<HTMLElement>;
  /** Currently selected date */
  selectedDays?: Date;
  /** Callback to handle mousedown event on picker container */
  pickerMouseDown?: () => void;
  /** Sets whether the picker should be displayed */
  open?: boolean;
  /** Callback triggered when a Day is clicked */
  onDayClick?: (date: Date, ev: React.MouseEvent<HTMLDivElement>) => void;
}

const popoverMiddleware = [
  offset(3),
  flip({
    fallbackStrategy: "initialPlacement",
  }),
];

export const DatePicker = ({
  inputElement,
  minDate,
  maxDate,
  selectedDays,
  disablePortal,
  onDayClick,
  pickerMouseDown,
  pickerProps,
  open,
}: DatePickerProps) => {
  const l = useLocale();
  const { localize, options } = l.date.dateFnsLocale();
  const { weekStartsOn } = options || /* istanbul ignore next */ {};
  const monthsLong = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => {
        const month = localize?.month(i);
        return month[0].toUpperCase() + month.slice(1);
      }),
    [localize]
  );
  const monthsShort = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) =>
        localize?.month(i, { width: "abbreviated" }).substring(0, 3)
      ),
    [localize]
  );
  const weekdaysLong = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => localize?.day(i)),
    [localize]
  );
  const weekdaysShort = useMemo(() => {
    const isGivenLocale = (str: string) => l.locale().includes(str);
    return Array.from({ length: 7 }).map((_, i) =>
      localize
        ?.day(
          i,
          ["de", "pl"].some(isGivenLocale)
            ? { width: "wide" }
            : { width: "abbreviated" }
        )
        .substring(0, isGivenLocale("de") ? 2 : 3)
    );
  }, [l, localize]);

  const handleDayClick = (
    date: Date,
    modifiers: DayModifiers,
    ev: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!modifiers.disabled) {
      const { id, name } = inputElement?.current
        ?.firstChild as HTMLInputElement;
      ev.target = {
        ...ev.target,
        id,
        name,
      } as HTMLInputElement;
      onDayClick?.(date, ev);
    }
  };

  const formatDay = (date: Date) =>
    `${weekdaysShort[date.getDay()]} ${date.getDate()} ${
      monthsShort[date.getMonth()]
    } ${date.getFullYear()}`;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      // this is a temporary fix for some axe issues that are baked into the library we use for the picker
      const captionElement = ref.current?.querySelector(".DayPicker-Caption");
      /* istanbul ignore else */
      if (captionElement) {
        captionElement.removeAttribute("role");
        captionElement.removeAttribute("aria-live");
      }

      // focus the selected or today's date first
      const selectedDay =
        ref.current?.querySelector(".DayPicker-Day--selected") ||
        ref.current?.querySelector(".DayPicker-Day--today");
      const firstDay = ref.current?.querySelector(
        ".DayPicker-Day[tabindex='0']"
      );

      /* istanbul ignore else */
      if (selectedDay && firstDay !== selectedDay) {
        selectedDay?.setAttribute("tabindex", "0");
        firstDay?.setAttribute("tabindex", "-1");
      }
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const localeUtils = { formatDay } as LocaleUtils;

  return (
    <Popover
      placement="bottom-start"
      reference={inputElement}
      middleware={popoverMiddleware}
      disablePortal={disablePortal}
    >
      <StyledDayPicker ref={ref} onMouseDown={pickerMouseDown}>
        <DayPicker
          month={selectedDays}
          months={monthsLong}
          firstDayOfWeek={weekStartsOn}
          onDayClick={handleDayClick}
          selectedDays={selectedDays}
          weekdayElement={(weekdayElementProps) => {
            const { className, weekday } = weekdayElementProps;

            return (
              <Weekday className={className} title={weekdaysLong[weekday]}>
                {weekdaysShort[weekday]}
              </Weekday>
            );
          }}
          navbarElement={<Navbar />}
          fixedWeeks
          initialMonth={selectedDays || undefined}
          disabledDays={getDisabledDays(minDate, maxDate)}
          locale={l.locale()}
          localeUtils={localeUtils}
          {...pickerProps}
        />
      </StyledDayPicker>
    </Popover>
  );
};

DatePicker.displayName = "DatePicker";

export default DatePicker;
