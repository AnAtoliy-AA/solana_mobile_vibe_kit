import React from 'react';

/* eslint-disable react/display-name */
const sanitizeProps = (props: Record<string, unknown>) => {
  const clone = { ...props };
  const dropBoolean = ['fullscreen', 'animated', 'translucent'];
  dropBoolean.forEach((attr) => {
    if (clone[attr]) {
      delete clone[attr];
    }
  });

  const rename: Record<string, string> = {
    defaultHref: 'data-default-href',
    fill: 'data-fill',
    slot: 'data-slot',
    color: 'data-color',
    expand: 'data-expand',
    interface: 'data-interface',
    size: 'data-size',
  };

  Object.entries(rename).forEach(([original, replacement]) => {
    if (clone[original] !== undefined) {
      clone[replacement] = clone[original];
      delete clone[original];
    }
  });

  return clone;
};

// eslint-disable-next-line react/display-name
const createComponent =
  (Tag: keyof JSX.IntrinsicElements = 'div') =>
  ({ children, ...props }: any) =>
    React.createElement(Tag, sanitizeProps(props), children);

const IonInput = ({ value, onIonInput, ...props }: any) => {
  const sanitized = sanitizeProps(props);
  return (
    <input
      {...sanitized}
      value={value}
      onChange={(event) =>
        onIonInput?.({
          detail: { value: event.target.value },
        })
      }
    />
  );
};

const IonButton = ({ children, ...props }: any) => (
  <button {...sanitizeProps(props)}>{children}</button>
);

const IonSelect = ({ children, value, onIonChange, ...props }: any) => {
  const sanitized = sanitizeProps(props);
  return (
    <select
      {...sanitized}
      value={value}
      onChange={(event) =>
        onIonChange?.({
          detail: { value: event.target.value },
        })
      }
    >
      {children}
    </select>
  );
};

const IonSelectOption = ({ children, value, ...props }: any) => (
  <option {...sanitizeProps(props)} value={value}>
    {children}
  </option>
);

const IonRefresher = ({ children, onIonRefresh: _onIonRefresh, ...props }: any) => {
  const sanitized = sanitizeProps(props);
  if (sanitized.onIonRefresh) {
    delete sanitized.onIonRefresh;
  }

  return <div {...sanitized}>{children}</div>;
};

const IonSearchbar = ({ value, onIonInput, ...props }: any) => {
  const sanitized = sanitizeProps(props);
  return (
    <input
      {...sanitized}
      value={value}
      onChange={(event) =>
        onIonInput?.({
          detail: { value: event.target.value },
        })
      }
    />
  );
};

const IonicMock = {
  IonPage: createComponent(),
  IonHeader: createComponent(),
  IonToolbar: createComponent(),
  IonTitle: createComponent(),
  IonContent: createComponent(),
  IonList: createComponent(),
  IonItem: createComponent(),
  IonLabel: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
  IonInput,
  IonButton,
  IonButtons: createComponent(),
  IonIcon: () => null,
  IonText: ({ children }: any) => <span>{children}</span>,
  IonModal: ({ isOpen, children }: any) => (isOpen ? <div>{children}</div> : null),
  IonBadge: createComponent(),
  IonCard: createComponent(),
  IonCardHeader: createComponent(),
  IonCardTitle: createComponent(),
  IonCardContent: createComponent(),
  IonSpinner: () => <span>spinner</span>,
  IonProgressBar: ({ value }: any) => <progress value={value} max={1} />,
  IonGrid: createComponent(),
  IonRow: createComponent(),
  IonCol: createComponent(),
  IonSelect,
  IonSelectOption,
  IonBackButton: createComponent('button'),
  IonRefresher,
  IonRefresherContent: createComponent(),
  IonSearchbar,
};

export default IonicMock;
