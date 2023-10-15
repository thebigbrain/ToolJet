import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { allSvgs } from '@tooljet/plugins/client';

const Card = ({
  title = null,
  src = null,
  handleClick = null,
  height = `50px`,
  width = `50px`,
  usePluginIcon = false,
  className = null,
  titleClassName = null,
  actionButton = null,
}) => {
  const DisplayIcon = ({ src }) => {
    if (typeof src !== 'string') return;

    if (usePluginIcon) {
      const Icon = allSvgs[src];
      return <Icon style={{ height, width }} className="card-icon" />;
    }

    return <img src={src} width={width} height={height} alt={title} />;
  };

  return (
    <div style={{ height: '112px', width: '164px' }} className={`col-md-2  mb-4 ${className}`}>
      <div
        className="card"
        role="button"
        onClick={(e) => {
          e.preventDefault();
          handleClick && handleClick();
        }}
        data-cy={`data-source-${String(title).toLocaleLowerCase()}`}
      >
        <div className="card-body">
          <center>
            <DisplayIcon src={src} />
            <br></br>
            <br></br>
            <span className={titleClassName}>{title}</span>
            {actionButton}
          </center>
        </div>
      </div>
    </div>
  );
};

export default Card;
