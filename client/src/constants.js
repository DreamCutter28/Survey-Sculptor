/** Было принято решение вынести ключи в константы, т.к.:
 * 1. Все в одном месте
 * Это значительно упрощает изменения, т.к. нужно обновить ключ только в одном месте,
 * и все ссылки на этот ключ в проекте будут автоматически обновлены. Удобство рефакторинга.
 *
 * 2. Меньше ошибок
 * Вручную печатая имя ключа можно ошибиться и долго дебажить; если использовать константу
 * и опечататься - код не скомпилируется
 *
 */

const INT_ID = 'interview_id';
const INT_QUESTION_ID = 'question_of_interview_id';
const QUESTION_ID = 'question_id';
const QUESTION_NAME = 'question_name';
const QUESTION_DESCRIPTION = 'question_description';

const REQUIRED = 'required';
const PRIORITY = 'priority';
const TRANSITION_TYPE = 'transition_type';

const QUESTION_OPTIONS = 'options_of_question';
const OPTION_ID = 'option_id';
const OPTION_TEXT = 'option_text';

const QUESTION_CONDITIONS = 'question_conditions';
const OPERAND_ID = 'operand_id';
const OPERAND_QUESTION_ID = 'operand_question_id';
const OPERAND_COMPARE_TYPE = 'operand_compare_type';
const Q_OPTIONS = 'q_options';
const OPTION_TYPE = 'option_type';

module.exports = {
    INT_QUESTION_ID,
    QUESTION_ID,
    QUESTION_NAME,
    QUESTION_DESCRIPTION,
    REQUIRED,
    PRIORITY,
    TRANSITION_TYPE,
    QUESTION_OPTIONS,
    OPTION_ID,
    OPTION_TEXT,
    QUESTION_CONDITIONS,
    OPERAND_ID,
    OPERAND_QUESTION_ID,
    OPERAND_COMPARE_TYPE,
    Q_OPTIONS,
    OPTION_TYPE,
};

// Из - за "вычисляемых свойств" в JS можно делать такие штуки:
// const INT_QUESTION_ID = 'question_of_interview_id';
// const obj = {
//     [INT_QUESTION_ID]: "123"
// };

/**
 * Квадратные скобки в этом случае важны:
 * В JS при определении свойства объекта без использования квадратных скобок,
 *  имя свойства будет буквально тем, что указали.
 */

// Это равносильно этой записи:
// const obj = {
//     question_of_interview_id: "123"
//   };

