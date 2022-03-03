let questionIds = [];
const questionTexts = {};
const questionContexts = {};
const questionAuthors = {};
const questionElements = {};

const setNewQuestionFormVisibility = (flag) => {
  document.getElementById('board-add-question').style.display =
      flag ? 'block' : 'none';
  document.getElementById('board-add-question-button').style.display =
      flag ? 'none' : 'inline-block';
  if (flag) {
    const area = document.getElementById('board-add-question-text');
    area.focus();
    area.addEventListener('input', onNewQuestionTextModified);
  }
};

const showNewQuestionForm = () => {
  return setNewQuestionFormVisibility(true);
};

const hideNewQuestionForm = () => {
  return setNewQuestionFormVisibility(false);
};

const onNewQuestionTextModified = (e) => {
  document.getElementById('board-add-question-remaining-chars').textContent = '' +
      e.target.value.length + '/280';
};

const fetchQuestionData = (questionId) => {
  fetch('/q-data/' + questionId).then((response) => {
    response.json().then((data) => {
      const obj = JSON.parse(data);
      questionTexts[questionId] = obj.text;
      questionContexts[questionId] = obj.context;
      questionElements[questionId].querySelector('.question-text').textContent =
          questionTexts[questionId];
      questionElements[questionId].querySelector('.question-context').textContent =
          questionContexts[questionId];
      questionElements[questionId].querySelector('.spinner').style.display = 'none';
    });
  });
};

const ensureQuestionData = () => {
  questionIds.forEach((id) => {
    if (questionTexts[id] === undefined || questionContexts[id] === undefined) {
      fetchQuestionData(id);
    }
  });
};

const ensureQuestionElements = () => {
  const template = document.getElementById('question-template');
  questionIds.forEach((id) => {
    if (!questionElements[id]) {
      const el = template.cloneNode(true /* deep */);
      el.setAttribute('id', 'question-' + id);
      document.getElementById('questions').appendChild(el);
      questionElements[id] = el;
    }
  });
};

const refresh = () => {
  fetch('/b-data/' + board.id).then((response) => {
    response.json().then((data) => {
      const obj = JSON.parse(data);
      questionIds = obj.questionIds;
      document.getElementById('questions').querySelector('.spinner').style.display = 'none';
      ensureQuestionData();
      ensureQuestionElements();
    });
  });
  // TODO: exponential backoff if the user is idle.
  window.setTimeout(refresh, 5000);
};
