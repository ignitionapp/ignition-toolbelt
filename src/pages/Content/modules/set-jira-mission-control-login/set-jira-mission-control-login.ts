import './style.css';
import {
  checkMissionControlLogin,
  checkPracticeLogin,
  getPracticeId,
} from './utils';
import { JIRA_MISSION_CONTROL_LOGIN, q, wait, waitForElement } from '../../lib';
import { makeMissionControlRequest } from '../../../../lib/graphql';

const DATA_ATTR = 'data-ignition-practice-reference-number';
const LINK_CLASSNAME = 'ignt-jira-mission-control-login-link';
const LINK_URL = 'https://go.ignitionapp.com/console/practice/';
const UNHANDLED_LINK_SELECTOR = `a[href^="${LINK_URL}"]:not([${DATA_ATTR}])`;

const iconUrl = chrome.runtime.getURL('icon-34.png');

const handleClickMissionControlLogin = async (e: MouseEvent) => {
  e.preventDefault();
  const linkEl = e.target as HTMLLinkElement;
  const targetUrl = 'https://go.ignitionapp.com/console';
  const settings = 'width=800,height=800,left=100,top=100';
  const newWindow = window.open(targetUrl, '_blank', settings);

  linkEl.classList.add('disabled');
  const timer = setInterval(() => {
    if (!newWindow) {
      linkEl.innerHTML = 'Reloading...';
      window.location.reload();
      clearTimeout(timer);
    }
  }, 1000);
};

const handleClick = async (e: MouseEvent) => {
  console.log('[DEBUG] handleClick()');

  e.preventDefault();

  const linkEl = e.target as HTMLLinkElement;
  const targetUrl = linkEl.href;
  const settings = 'width=1,height=1,left=-1000,top=-1000';
  const newWindow = window.open(targetUrl, '_blank', settings);
  linkEl.innerHTML = 'Logging in...';
  linkEl.classList.add('disabled');

  if (!newWindow) {
    return;
  }

  await wait(1000);
  newWindow.close();

  linkEl.classList.add('disabled');
  linkEl.innerHTML = `You've logged in`;
  // try {
  //   const referenceNumber = linkEl.getAttribute(DATA_ATTR);
  //   if (referenceNumber) {
  //     const hasLogin = await checkPracticeLogin({ referenceNumber });
  //     if (hasLogin) {
  //       linkEl.classList.add('disabled');
  //       linkEl.innerHTML = `You've logged in`;
  //     }
  //   }
  // } catch (e: unknown) {
  //   if (e instanceof Error) {
  //     console.error(e.message);
  //   }
  // }
};

const renderContainer = (rootEl: HTMLElement, practiceId: string) => {
  console.log(`[DEBUG] renderContainer(rootEl, practiceId = ${practiceId})`);
  rootEl.style.position = 'relative';
  rootEl.setAttribute(DATA_ATTR, practiceId);

  const containerEl = document.createElement('div');
  containerEl.className = 'ignt-jira-mission-control-login';
  containerEl.style.top = `${rootEl.offsetHeight + 20}px`;
  containerEl.style.right = '5px';
  containerEl.innerHTML = [
    `<img class="ignt-jira-mission-control-login-logo" src="${iconUrl}" alt="Ignition logo" />`,
    `<a href="#" class="ignt-jira-mission-control-login-link disabled" ${DATA_ATTR}="#">Detecting...</a>`,
  ].join('&nbsp;');
  if (rootEl.parentNode?.parentNode)
    rootEl.parentNode.parentNode.appendChild(containerEl);
  return containerEl;
};

const run = async (value = null) => {
  console.log('[DEBUG] run()');
  const result = await chrome.storage.local.get([JIRA_MISSION_CONTROL_LOGIN]);
  const isEnabled = value ? value : result[JIRA_MISSION_CONTROL_LOGIN] || false;
  if (!isEnabled) {
    document
      .querySelectorAll('[data-ignition-practice-reference-number]')
      .forEach((el) => {
        el.removeAttribute('data-ignition-practice-reference-number');
      });
    document
      .querySelectorAll('.ignt-jira-mission-control-login')
      .forEach((el) => {
        el.parentNode?.removeChild(el);
      });
    return;
  }

  const targetEl = await waitForElement<HTMLLinkElement>(
    UNHANDLED_LINK_SELECTOR
  );
  if (!targetEl) return;

  const href = targetEl.getAttribute('href');
  if (!href) return;

  const practiceId = getPracticeId(href);
  if (!practiceId) return;

  const containerEl = renderContainer(targetEl, practiceId);
  const linkEl = q<HTMLLinkElement>(`.${LINK_CLASSNAME}`, containerEl);
  if (!linkEl) return;

  try {
    const isMissionControlLogin = await checkMissionControlLogin();
    console.log('[DEBUG] run(): isMissionControlLogin', isMissionControlLogin);
    if (!isMissionControlLogin) {
      linkEl.innerHTML = `Login to Mission Control`;
      linkEl.addEventListener('click', handleClickMissionControlLogin);
      linkEl.setAttribute('href', 'https://go.ignitionapp.com/console');
      linkEl.classList.remove('disabled');
      linkEl.dataset.ignitionPracticeReferenceNumber = 'mission-control';
      return;
    }

    const { practice } = await makeMissionControlRequest({
      query: `query practice($id: ID!) { practice(id: $id) { referenceNumber } }`,
      variables: { id: practiceId },
    });
    const { referenceNumber } = practice;
    const targetUrl = `https://go.ignitionapp.com/admin/sign_in_as_support/${practice.referenceNumber}`;
    linkEl.dataset.ignitionPracticeReferenceNumber = referenceNumber;
    linkEl.setAttribute('href', targetUrl);

    const hasPracticeLogin = await checkPracticeLogin({ referenceNumber });
    console.log('[DEBUG] run: hasPracticeLogin', hasPracticeLogin);
    if (hasPracticeLogin) {
      linkEl.innerHTML = `You've logged in`;
    } else {
      linkEl.innerHTML = 'Log in as the account';
      linkEl.classList.remove('disabled');
      linkEl.addEventListener('click', handleClick);
    }
  } catch (e) {
    if (e instanceof Error) {
      linkEl.innerHTML = 'Error';
      console.error(e.message);
    }
  } finally {
    run();
  }
};

export const setJiraMissionControlLogin = () => {
  chrome.runtime.onMessage.addListener(async ({ type }) => {
    if (type === JIRA_MISSION_CONTROL_LOGIN) {
      await run();
    }
  });

  chrome.storage.local.onChanged.addListener(async (changes) => {
    const featureFlags = Object.keys(changes);
    if (featureFlags.includes(JIRA_MISSION_CONTROL_LOGIN)) {
      await run(changes[JIRA_MISSION_CONTROL_LOGIN].newValue);
    }
  });
};
