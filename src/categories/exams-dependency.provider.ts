export const EXAMS_DEPENDENCY_PROVIDER = 'EXAMS_DEPENDENCY_PROVIDER';

export interface IExamsDependencyProvider {
  /**
   * Checks if a category has any linked exams.
   * Returns true if exams exist, false otherwise.
   */
  hasLinkedExams(categoryId: string): Promise<boolean>;
}
