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
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Customize your {item.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {item.customizations &&
            item.customizations.map((customizationCategory) => (
              <div key={customizationCategory.name} className="bg-gray-700 p-4 rounded-md">
                <Label className="text-lg font-semibold mb-3 block">{customizationCategory.name}</Label>
                {customizationCategory.type === 'single' ? (
                  <RadioGroup
                    value={customizations[customizationCategory.name] || ''}
                    onValueChange={(value) => handleSingleOptionChange(customizationCategory.name, value)}
                  >
                    {customizationCategory.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2 my-2">
                        <RadioGroupItem value={option} id={`${customizationCategory.name}-${option}`} />
                        <Label htmlFor={`${customizationCategory.name}-${option}`} className="text-white">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  customizationCategory.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2 my-2">
                      <Checkbox
                        id={`${customizationCategory.name}-${option}`}
                        checked={(customizations[customizationCategory.name] || []).includes(option)}
                        onCheckedChange={() => handleMultipleOptionChange(customizationCategory.name, option)}
                      />
                      <Label htmlFor={`${customizationCategory.name}-${option}`} className="text-white">{option}</Label>
                    </div>
                  ))
                )}
              </div>
            ))}
        </div>
        <DialogFooter>
          <Button onClick={handleAddToCart} className="bg-blue-600 hover:bg-blue-700 text-white">Add to Cart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizationModal;