/**
 * This code is a modified version of useReplicant to integrate options to ensure it is always defined (essentially forcing defaults to exist)
 * It also fixes the warnings with using the replicant when it may not be defined
 * MIT © Keiichiro Amemiya (Hoishin)
 * https://github.com/nodecg/react-hooks
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { klona as clone } from "klona/json";
import { Jsonify } from "type-fest";

export type UseReplicantOptions<T> = {
	defaultValue: T;
	bundle?: string;
	persistent?: boolean;
};

/**
 * Subscribe to a replicant, returns tuple of the replicant value and `setValue` function.
 * The component using this function gets re-rendered when the value is updated.
 * The `setValue` function can be used to update replicant value.
 * @param replicantName The name of the replicant to use
 * @param initialValue Initial value to pass to `useState` function
 * @param options Options object. Currently supports the optional `namespace` option
 */
export const useReplicant = <V, T = Jsonify<V>>(
	replicantName: string,
	{ bundle, defaultValue, persistent }: UseReplicantOptions<T>,
) => {
	const replicant = useMemo(() => {
		if (typeof bundle === "string") {
			return nodecg.Replicant<T>(replicantName, bundle, {
				defaultValue,
				persistent,
			});
		}
		return nodecg.Replicant<T>(replicantName, { defaultValue, persistent });
	}, [bundle, defaultValue, persistent, replicantName]);

	const [value, setValue] = useState(defaultValue);

	useEffect(() => {
		

		const changeHandler = (newValue: T): void => {

			setValue((oldValue) => {
				if (newValue !== oldValue) {
					return newValue;
				}
				return clone(newValue);
			});
		};

		const changeWrapper = (newValue: T | undefined): void => newValue && changeHandler(newValue)

		replicant.on("change", changeWrapper);
		return () => {
			replicant.removeListener("change", changeWrapper);
		};
	}, [replicant]);

	const updateValue = useCallback(
		(newValue: T | ((oldValue?: T) => void)) => {
			if (typeof newValue === "function") {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				(newValue as any)(replicant.value);
			} else {
				replicant.value = newValue;
			}
		},
		[replicant],
	);

	return [value, updateValue] as const;
};