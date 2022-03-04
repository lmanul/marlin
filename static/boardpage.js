const QUESTION_HEIGHT_EX = 25;
const QUESTION_MARGIN_EX = 2;

let questionIds = [];
let questionVotes = {};
let ownQuestionVotes = {};
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
      questionAuthors[questionId] = obj.authorName;
      questionElements[questionId].querySelector('.question-text').textContent =
          questionTexts[questionId];
      questionElements[questionId].querySelector('.question-context').textContent =
          questionContexts[questionId];
      questionElements[questionId].querySelector('.question-author').textContent =
          '— ' + (questionAuthors[questionId] || 'Anonymous');
      questionElements[questionId].querySelector('.spinner').style.display = 'none';
    });
  });
};

const topPositionForIndex = (index) => {
  return (index * (QUESTION_HEIGHT_EX + QUESTION_MARGIN_EX)) + 'ex';
};

const getQuestionScore = (questionId) => {
  const votes = questionVotes[questionId];
  if (!votes) {
    return 0;
  }
  const score = Math.floor(votes.up - 0.5 * votes.meh - 1.5 * votes.down);
  return score;
};

const positionQuestions = () => {
  let i = 0;
  let sortedQuestionIds = [...questionIds];
  sortedQuestionIds.sort((a, b) => {
    return getQuestionScore(b) - getQuestionScore(a);
  });
  sortedQuestionIds.forEach((id) => {
    const el = questionElements[id];
    el.style.top = topPositionForIndex(i++);
  });
  document.querySelector('main').style.height =
      (questionIds.length + 1) * (QUESTION_HEIGHT_EX + QUESTION_MARGIN_EX) + 'ex';
};

const vote = (questionId, vote) => {
  fetch('/action-vote/' + questionId + '/' + vote).then(() => {
    console.log('Voted "' + vote + '" on question "' + questionId + '"');
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
      const voteEls = el.querySelectorAll('.question-voting-updown');
      voteEls.forEach((el) => { el.setAttribute('data-id', id); });
      el.addEventListener('click', (e) => {
        vote(e.target.getAttribute('data-id'), e.target.getAttribute('data'));
      });
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
      questionVotes = obj.questionVotes;
      const container = document.getElementById('questions');
      const globalSpinner = container.querySelector('.spinner');
      if (!!globalSpinner) {
        globalSpinner.style.display = 'none';
      }
      if (!questionIds || !questionIds.length) {
        container.innerHTML =
            '<big style="display: block; text-align: center;">∅</big>';
      }
      ensureQuestionData();
      ensureQuestionElements();
      positionQuestions();
    });
  });
  // TODO: exponential backoff if the user is idle.
  window.setTimeout(refresh, 5000);
};
