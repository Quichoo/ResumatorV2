export type ResumeTextPreview = {
  text: string;
  pageCount: number;
};

export type ExtractResumeTextResult =
  | {
      success: true;
      message: string;
      data: ResumeTextPreview;
    }
  | {
      success: false;
      message: string;
    };
