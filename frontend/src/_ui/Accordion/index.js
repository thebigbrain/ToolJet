import React from 'react';
import AccordionItem from './AccordionItem';

const Accordion = ({ items }) => {
  return (
    <div className="accordion">
      {items.map(({ title, isOpen, children }, index) => {
        return (
          <AccordionItem open={isOpen} key={`$title}_${index}`} index={index} title={title}>
            {children}
          </AccordionItem>
        );
      })}
    </div>
  );
};

export default Accordion;
