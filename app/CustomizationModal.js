import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Plus, CheckCircle } from 'lucide-react';

const CustomizationModal = ({ item, onClose, onAddToCart }) => {
  const [customizations, setCustomizations] = useState({});

  // Process the customization options to create a standardized format
  const formatCustomizationOptions = (customization) => {
    if (!customization.options) return [];
    
    // Handle the case where options are simple strings or objects
    return customization.options.map(option => {
      if (typeof option === 'string') {
        return {
          value: option.toLowerCase().replace(/\s+/g, '-'),
          label: option,
          price: 0
        };
      } else if (typeof option === 'object') {
        return {
          value: option.value || option.name || option.toLowerCase().replace(/\s+/g, '-'),
          label: option.label || option.name || option,
          price: option.price || 0
        };
      }
      return { value: 'unknown', label: 'Unknown Option', price: 0 };
    });
  };

  // Handle price modifiers for complex customization types
  const calculateOptionPrice = (category, option) => {
    if (category.priceModifier && category.priceModifier[option]) {
      return category.priceModifier[option];
    }
    if (category.extraCost && category.type === 'multiple') {
      return category.extraCost;
    }
    return 0;
  };

  const handleSingleOptionChange = (categoryName, option) => {
    setCustomizations((prev) => ({
      ...prev,
      [categoryName]: option
    }));
  };

  const handleMultipleOptionChange = (categoryName, option) => {
    setCustomizations((prev) => {
      const prevOptions = prev[categoryName] || [];
      const isSelected = prevOptions.some(o => o.value === option.value);
      
      if (isSelected) {
        return {
          ...prev,
          [categoryName]: prevOptions.filter(o => o.value !== option.value)
        };
      } else {
        return {
          ...prev,
          [categoryName]: [...prevOptions, option]
        };
      }
    });
  };

  const handleAddToCart = () => {
    // Check if all required customizations have been selected
    const missingRequired = item.customizations
      .filter(cat => cat.required)
      .filter(cat => !customizations[cat.name] || 
        (Array.isArray(customizations[cat.name]) && customizations[cat.name].length === 0));
    
    if (missingRequired.length > 0) {
      alert(`Please select options for: ${missingRequired.map(cat => cat.name).join(', ')}`);
      return;
    }
    
    onAddToCart(customizations);
  };

  const isRequired = (category) => {
    return category.required === true;
  };

  const isOptionSelected = (category, option) => {
    if (!customizations[category.name]) return false;
    
    if (category.type === 'single') {
      return customizations[category.name].value === option.value;
    } else {
      return (customizations[category.name] || []).some(o => o.value === option.value);
    }
  };

  const getSelectedValue = (category) => {
    if (!customizations[category.name]) return '';
    return customizations[category.name].value || '';
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            Customize your {item.name}
          </DialogTitle>
          <DialogDescription>
            Select your preferences to personalize your order
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-2 max-h-[60vh] overflow-y-auto pr-1">
          {item.customizations &&
            item.customizations.map((category) => {
              const options = formatCustomizationOptions(category);
              return (
                <div key={category.name} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <Label className="text-base font-medium">{category.name}</Label>
                    {isRequired(category) && (
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {category.type === 'single' ? (
                      <RadioGroup 
                        value={getSelectedValue(category)}
                        onValueChange={(value) => {
                          const selectedOption = options.find(opt => opt.value === value);
                          if (selectedOption) {
                            const price = calculateOptionPrice(category, selectedOption.label);
                            handleSingleOptionChange(category.name, {
                              ...selectedOption,
                              price: price || selectedOption.price
                            });
                          }
                        }}
                        className="space-y-2"
                      >
                        {options.map((option) => {
                          const price = calculateOptionPrice(category, option.label);
                          const displayPrice = price > 0 ? `+$${price.toFixed(2)}` : (price < 0 ? `-$${Math.abs(price).toFixed(2)}` : '');
                          
                          return (
                            <div 
                              key={option.value} 
                              className={`flex items-center justify-between p-2 rounded-md transition-colors cursor-pointer
                                ${getSelectedValue(category) === option.value ? 'bg-primary/10' : 'hover:bg-muted'}`}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem 
                                  value={option.value} 
                                  id={`${category.name}-${option.value}`}
                                  className="cursor-pointer"
                                />
                                <Label 
                                  htmlFor={`${category.name}-${option.value}`} 
                                  className="cursor-pointer"
                                >
                                  {option.label}
                                </Label>
                              </div>
                              
                              {displayPrice && (
                                <span className="text-sm font-medium">
                                  {displayPrice}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </RadioGroup>
                    ) : (
                      options.map((option) => {
                        const isSelected = isOptionSelected(category, option);
                        const price = calculateOptionPrice(category, option.label);
                        const displayPrice = price > 0 ? `+$${price.toFixed(2)}` : (price < 0 ? `-$${Math.abs(price).toFixed(2)}` : '');
                        
                        return (
                          <div 
                            key={option.value} 
                            className={`flex items-center justify-between p-2 rounded-md transition-colors cursor-pointer
                              ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'}`}
                            onClick={() => {
                              handleMultipleOptionChange(category.name, {
                                ...option,
                                price: price || option.price
                              });
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id={`${category.name}-${option.value}`} 
                                checked={isSelected}
                                className="cursor-pointer"
                                onCheckedChange={() => {
                                  handleMultipleOptionChange(category.name, {
                                    ...option,
                                    price: price || option.price
                                  });
                                }}
                              />
                              <Label 
                                htmlFor={`${category.name}-${option.value}`} 
                                className="cursor-pointer"
                              >
                                {option.label}
                              </Label>
                            </div>
                            
                            {displayPrice && (
                              <span className="text-sm font-medium">
                                {displayPrice}
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
        </div>
        
        <DialogFooter className="flex justify-between items-center pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddToCart} className="px-6">
            <Plus className="h-4 w-4 mr-1" /> Add to Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizationModal;