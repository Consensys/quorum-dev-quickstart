export interface AnswerMap {
    [index: string]: any;
}

/**
 * Represents a tree of questions that can be used to build up a template context
 */
export interface QuestionTree {
    /**
     * The text that the user is shown before waiting for answer input
     */
    prompt: string;

    /**
     * The name of the question, also used as a variable name in the resulting
     * template context
     */
    name: string;

    /**
     * An optional list of options for multiple-choice questions.
     */
    options?: QuestionOption[];

    /**
     * Transformation and validation function that can be used for both free
     * form and multiple choice question types.
     *
     * @param transformerValidator a function that transforms valid input to
     * the answer data desired and throws on invalid input. Mutates the given
     * AnswerMap as needed. Returns a follow-up question, if necessary. Can be
     * async.
     */
    transformerValidator?: (rawInput: any, answers: AnswerMap) => Promise<QuestionTree | undefined> | QuestionTree | undefined;
}

/**
 * Represents a single option in a list of options for a multiple choice
 * question.
 */
export interface QuestionOption {
    /**
     * The text shown to the user to describe this option.
     */
    label: string;

    /**
     * The value that should be used when this option is selected. If the
     * question also contains a transformerValidator, this is data will be
     * passed as rawInput.
     */
    value: any;

    /**
     * The follow-up question that should be given to the user after this one,
     * if applicable.
     */
    nextQuestion?: QuestionTree;
}

const _permissioningQuestion: QuestionTree = {
    name: "permissioning",
    prompt: "Do you wish to enable permissioning?",
    options: [
        // TODO: fix these to the correct names
        { label: "Yes", value: true },
        { label: "No", value: false }
    ]
};

const _privacyQuestion: QuestionTree = {
    name: "privacy",
    prompt: "Do you wish to enable privacy?",
    options: [
        // TODO: fix these to the correct names
        { label: "Yes", value: true, nextQuestion: _permissioningQuestion },
        { label: "No", value: false, nextQuestion: _permissioningQuestion }
    ]
};

const _nodeCountQuestion: QuestionTree = {
    name: "nodeCount",
    prompt: "How many validator nodes do you wish to run? Answer must be between 4 and 7.",
    transformerValidator: (rawInput: any, answers: AnswerMap) => {
        const result = parseInt(rawInput, 10);
        if (result >= 4 && result <= 7) {
            answers.nodeCount = result;
            return _privacyQuestion;
        } else {
            return _nodeCountQuestion;
        }
    }
};

export const rootQuestion: QuestionTree = {
    name: "clientType",
    prompt: "Which type of client would you like to run?",
    options: [
        // TODO: fix these to the correct names
        { label: "Go Quorum", value: "gquorum", nextQuestion: _nodeCountQuestion },
        { label: "Java Quorum", value: "jquorum", nextQuestion: _nodeCountQuestion }
    ]
};