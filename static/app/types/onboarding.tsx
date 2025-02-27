import {Organization, Project} from 'sentry/types';
import {OnboardingState} from 'sentry/views/onboarding/targetedOnboarding/types';

import type {AvatarUser} from './user';

export enum OnboardingTaskKey {
  FIRST_PROJECT = 'create_project',
  FIRST_EVENT = 'send_first_event',
  INVITE_MEMBER = 'invite_member',
  SECOND_PLATFORM = 'setup_second_platform',
  USER_CONTEXT = 'setup_user_context',
  RELEASE_TRACKING = 'setup_release_tracking',
  SOURCEMAPS = 'setup_sourcemaps',
  USER_REPORTS = 'setup_user_reports',
  ISSUE_TRACKER = 'setup_issue_tracker',
  ALERT_RULE = 'setup_alert_rules',
  FIRST_TRANSACTION = 'setup_transactions',
  METRIC_ALERT = 'setup_metric_alert_rules',
  USER_SELECTED_PROJECTS = 'setup_userselected_projects',
  INTEGRATIONS = 'setup_integrations',
}

export type OnboardingSupplementComponentProps = {
  onCompleteTask: () => void;
  task: OnboardingTask;
};

export type OnboardingCustomComponentProps = {
  onboardingState: OnboardingState | null;
  organization: Organization;
  projects: Project[];
  setOnboardingState: (state: OnboardingState | null) => void;
  task: OnboardingTask;
};

export type OnboardingTaskDescriptor = {
  description: string;
  /**
   * Should the onboarding task currently be displayed
   */
  display: boolean;
  /**
   * A list of require task keys that must have been completed before these
   * tasks may be completed.
   */
  requisites: OnboardingTaskKey[];
  /**
   * Can this task be skipped?
   */
  skippable: boolean;
  task: OnboardingTaskKey;
  title: string;
  /**
   * An extra component that may be rendered within the onboarding task item.
   */
  SupplementComponent?: React.ComponentType<OnboardingSupplementComponentProps>;
  /**
   * If a render function was provided, it will be used to render the entire card,
   * and the card will be rendered before any other cards regardless of completion status.
   * the render function is therefore responsible for determining the completion status
   * of the card by returning null when it's completed.
   *
   * Note that this should not be given a react component.
   */
  renderCard?: (props: OnboardingCustomComponentProps) => JSX.Element | null;
} & (
  | {
      actionType: 'app' | 'external';
      location: string;
    }
  | {
      action: () => void;
      actionType: 'action';
    }
);

export type OnboardingTaskStatus = {
  status: 'skipped' | 'pending' | 'complete';
  task: OnboardingTaskKey;
  completionSeen?: string;
  data?: {[key: string]: string};
  dateCompleted?: string;
  user?: AvatarUser | null;
};

export type OnboardingTask = OnboardingTaskStatus &
  OnboardingTaskDescriptor & {
    /**
     * Onboarding tasks that are currently incomplete and must be completed
     * before this task should be completed.
     */
    requisiteTasks: OnboardingTask[];
  };
