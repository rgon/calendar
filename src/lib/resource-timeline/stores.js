import {derived} from 'svelte/store';
import {createSlotTimeLimits, createTimes} from '../lib/index.js';

// slotTimeLimits per day
export function dayTimeLimits(state) {
    return derived(
        [state.slotMinTime, state.slotMaxTime, state.flexibleSlotTimeLimits, state._viewDates, state._events],
        ([$slotMinTime, $slotMaxTime, $flexibleSlotTimeLimits, $_viewDates, $_events]) => {
            let dayTimeLimits = {};
            for (let date of $_viewDates) {
                dayTimeLimits[date.getTime()] = createSlotTimeLimits(
                    $slotMinTime,
                    $slotMaxTime,
                    $flexibleSlotTimeLimits,
                    [date],
                    $_events
                );
            }

            return dayTimeLimits;
        }
    );
}

export function dayTimes(state) {
    return derived(
        [state._viewDates, state.slotDuration, state._dayTimeLimits, state._intlSlotLabel],
        ([$_viewDates, $slotDuration, $_dayTimeLimits, $_intlSlotLabel]) => {
            let dayTimes = {};
            for (let date of $_viewDates) {
                let time = date.getTime();
                dayTimes[time] = time in $_dayTimeLimits
                    ? createTimes(date, $slotDuration, $_dayTimeLimits[time], $_intlSlotLabel)
                    : [];
            }

            return dayTimes;
        }
    );
}
