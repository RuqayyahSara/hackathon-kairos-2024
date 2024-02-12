
export default question = `I have an assessment of 2 questions timed for 30 minutes. The interviewee answered 2/2 questions in a span of 30 minutes. I will provide the code for each question below. Review my code and tell me how skilled a programmer he is. Categorise it into quantitative and qualitative coding metrics. Make sure to apply all the valid test cases to the corresponding problem for better results.  
I also want you to infer the personality traits of the coder from the above metrics that you evaluated and add other traits such as work under pressure, collaborator, communication, leadership skills, time management, continuous learning, accountability & critical thinking etc.  Give me the scoring out of 10 and give a one line explanation of each trait in the 'explanation' property. Show me the results in JSON format. Please follow the json schema given below. And dont give any explanations outside the json

{
  "QuantitativeMetrics": {
    "LinesOfCode": "Number",
    "CodeChurn": "Number",
    "Efficiency": "Number",
    "Cyclomatic complexity" : "Number",
    "code duplication" :"Number",
  },
  "QualitativeMetrics": {
    "Readability": "Number",
    "Modularity": "Number",
    "Comments": "Number",
    "variable_naming": "Number",
    "ErrorHandling": "Number"
  },
  "PersonalityTraits": {
    "WorkUnderPressure": {"score": "Number", "explanation": "String"},
    "Collaborator": {"score": "Number", "explanation": "String"},
    "Communication": {"score": "Number", "explanation": "String"},
    "LeadershipSkills": {"score": "Number", "explanation": "String"},
    "TimeManagement": {"score": "Number", "explanation": "String"},
    "ContinuousLearning": {"score": "Number", "explanation": "String"},
    "Accountability": {"score": "Number", "explanation": "String"},
    "CriticalThinking": {"score": "Number", "explanation": "String"},
  },
  "FinalScore": "Number"
}
Finally, give me the Final score of the interviewer as a skilled coder based on the metrics and personality traits.
 
Question 1 -  
code - 
 
Question 2 -  
code - `