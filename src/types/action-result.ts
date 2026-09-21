export type FieldErrors<TField extends string> = Partial<
  Record<TField, string[]>
>;

export type FormActionResult<TField extends string> =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: FieldErrors<TField>;
    };
