import type { z } from "zod";
import type { certificationSchema } from "@/lib/validations/certification";
import type { FieldErrors, FormActionResult } from "@/types/action-result";

export type CertificationFormValues = z.input<typeof certificationSchema>;

export type Certification = z.output<typeof certificationSchema> & {
  id: string;
};

export type CertificationFieldErrors = FieldErrors<
  keyof CertificationFormValues
>;

export type CertificationActionResult = FormActionResult<
  keyof CertificationFormValues
>;

export type GetCertificationsResult =
  | {
      success: true;
      certifications: Certification[];
    }
  | {
      success: false;
      message: string;
    };

export type CertificationReviewEntry = Required<CertificationFormValues>;
