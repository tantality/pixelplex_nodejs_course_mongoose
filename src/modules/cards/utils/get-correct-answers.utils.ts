export const getCorrectAnswers = (correctAnswersQueryResult: { correctAnswers: string[] }[]): string[] => {
  if (!correctAnswersQueryResult.length) {
    return [];
  }

  const { correctAnswers } = correctAnswersQueryResult[0];

  return correctAnswers;
};
