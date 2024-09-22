// CustomizationModal.js

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const CustomizationModal = ({ item, isOpen, onClose, addToCart }) => {
  const [customizations, setCustomizations] = useState({});

  const handleSingleOptionChange = (category, option) => {
    setCustomizations((prevState) => ({
      ...prevState,
      [category]: option,
    }));
  };

  const handleMultipleOptionChange = (category, option) => {
    setCustomizations((prevState) => {
      const prevOptions = prevState[category] || [];
      if (prevOptions.includes(option)) {
        return {
          ...prevState,
          [category]: prevOptions.filter((opt) => opt !== option),
        };
      } else {
        return {
          ...prevState,
          [category]: [...prevOptions, option],
        };
      }
    });
  };

  const handleAddToCart = () => {
    addToCart(item, customizations);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize your {item.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {item.customizations &&
            item.customizations.map((customizationCategory) => (
              <div key={customizationCategory.name}>
                <Label>{customizationCategory.name}</Label>
                {customizationCategory.type === 'single' ? (
                  <RadioGroup
                    value={customizations[customizationCategory.name] || ''}
                    onValueChange={(value) => handleSingleOptionChange(customizationCategory.name, value)}
                  >
                    {customizationCategory.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${customizationCategory.name}-${option}`} />
                        <Label htmlFor={`${customizationCategory.name}-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  customizationCategory.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${customizationCategory.name}-${option}`}
                        checked={(customizations[customizationCategory.name] || []).includes(option)}
                        onCheckedChange={() => handleMultipleOptionChange(customizationCategory.name, option)}
                      />
                      <Label htmlFor={`${customizationCategory.name}-${option}`}>{option}</Label>
                    </div>
                  ))
                )}
              </div>
            ))}
        </div>
        <DialogFooter>
          <Button onClick={handleAddToCart}>Add to Cart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizationModal;