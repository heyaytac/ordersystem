'use client';
import React, { useState, useEffect, useCallback } from 'react';
import CustomizationModal from './CustomizationModal'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trash2, Check, Plus, Minus, Clock, ShoppingCart, ShoppingBag, User, Send, ChevronRight, Search } from 'lucide-react';
import { kebabShopMenu } from './menu-data';
import { v4 as uuidv4 } from 'uuid';
import { ModeToggle } from '@/components/mode-toggle';

export default function KebabStoreOwner() {
  // Convert menu object to flat array with category property for easier processing
  const menuArray = Object.entries(kebabShopMenu).flatMap(([category, items]) => 
    items.map(item => ({
      ...item,
      category,
      // Add description and image if not present
      description: item.description || `Delicious ${item.name} prepared with fresh ingredients`,
      image: item.image || `https://source.unsplash.com/featured/?${item.name.toLowerCase().replace(/\s+/g, '-')}`,
      customizable: item.customizations && item.customizations.length > 0
    }))
  );

  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState(Object.keys(kebabShopMenu)[0]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          remainingTime: Math.max(0, order.remainingTime - 1),
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const addToCart = useCallback((item, customizations = {}) => {
    setCart((prevCart) => {
      // Create a unique identifier for the item based on its id and customizations
      const cartItemId = `${item.id}-${JSON.stringify(customizations)}`;
      const existingItem = prevCart.find((cartItem) => cartItem.cartItemId === cartItemId);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.cartItemId === cartItemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Add a new item to the cart
        return [...prevCart, { ...item, quantity: 1, customizations, cartItemId }];
      }
    });
  }, []);

  const removeFromCart = useCallback((cartItemId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.cartItemId === cartItemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.cartItemId === cartItemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        return prevCart.filter((cartItem) => cartItem.cartItemId !== cartItemId);
      }
    });
  }, []);

  const removeItemCompletely = useCallback((cartItemId) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.cartItemId !== cartItemId));
  }, []);
  
  const calculateTotalPrice = (cart) => {
    return cart.reduce((total, item) => {
      const basePrice = item.price * item.quantity;
      const customizationPrice = item.customizations ? 
        Object.values(item.customizations).reduce((sum, option) => {
          return sum + (option.price || 0);
        }, 0) * item.quantity : 0;
      return total + basePrice + customizationPrice;
    }, 0).toFixed(2);
  };

  const placeOrder = (customerInfo) => {
    if (cart.length === 0) return;

    const newOrder = {
      id: uuidv4(),
      customer: customerInfo,
      items: [...cart],
      totalPrice: calculateTotalPrice(cart),
      status: 'preparing',
      remainingTime: 30, // 30 minutes preparation time
      timestamp: new Date().toISOString(),
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    setCart([]);
  };

  const deleteOrder = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
  };

  const markAsPickedUp = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: 'completed' } : order))
    );
  };

  function Header() {
    return (
      <div className="sticky top-0 z-10 bg-card shadow-md py-3 px-4 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShoppingBag className="text-accent h-6 w-6" />
          <h1 className="text-xl font-bold">Quick Kebab Ordering System</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Active Orders: {orders.filter(o => o.status !== 'completed').length}
          </span>
          <Button variant="outline" size="sm" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
            <Clock className="h-4 w-4 mr-1 sm:mr-2" /> 
            <span className="hidden sm:inline">View Orders</span>
          </Button>
          <ModeToggle />
        </div>
      </div>
    );
  }

  const MenuItem = ({ item, addToCart }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddToOrderClick = () => {
      if (item.customizable) {
        setIsModalOpen(true);
      } else {
        addToCart(item);
      }
    };

    const handleAddCustomization = (customizations) => {
      addToCart(item, customizations);
      setIsModalOpen(false);
    };

    const handleModalClose = () => {
      setIsModalOpen(false);
    };

    return (
      <>
        <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-medium">{item.name}</CardTitle>
              <span className="font-semibold text-primary">${item.price.toFixed(2)}</span>
            </div>
            <CardDescription className="mt-1 text-xs line-clamp-2">{item.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {item.image && (
              <div className="rounded-md overflow-hidden h-40 mb-2">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              onClick={handleAddToOrderClick} 
              className="w-full" 
              variant="default"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" /> Add to Order
            </Button>
          </CardFooter>
        </Card>
        {isModalOpen && (
          <CustomizationModal
            item={item}
            onClose={handleModalClose}
            onAddToCart={handleAddCustomization}
          />
        )}
      </>
    );
  };

  const Menu = ({ addToCart }) => {
    // Get unique categories from the keys of the menu object
    const categories = Object.keys(kebabShopMenu);
    
    // Filter menu items based on search or active tab
    const filteredMenu = searchTerm
      ? menuArray.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      : menuArray.filter(item => item.category === activeTab);

    return (
      <div className="mb-8">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-accent" />
            Menu
          </h2>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search menu..." 
              className="pl-8 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {!searchTerm && (
          <Tabs defaultValue={activeTab} className="mb-4" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:flex md:flex-wrap h-auto">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-sm py-2">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              <MenuItem key={item.id} item={item} addToCart={addToCart} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No menu items found. Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const Cart = ({ cart, removeFromCart, addToCart, removeItemCompletely }) => {
    const totalPrice = calculateTotalPrice(cart);
    
    const formatCustomizations = (customizations) => {
      if (!customizations || Object.keys(customizations).length === 0) return '';
      
      return Object.entries(customizations).map(([key, value]) => {
        return `${key}: ${value.label}${value.price ? ` (+$${value.price.toFixed(2)})` : ''}`;
      }).join(', ');
    };

    return (
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-accent" />
              Your Order
            </CardTitle>
            {cart.length > 0 && (
              <span className="text-sm font-medium px-2 py-1 bg-accent text-accent-foreground rounded-full">
                {cart.reduce((acc, item) => acc + item.quantity, 0)} items
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-xs text-muted-foreground mt-1">Add items from the menu to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex items-start justify-between pb-4 border-b">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="font-medium">{item.name}</div>
                      <div className="font-medium text-right">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    
                    {item.customizations && Object.keys(item.customizations).length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatCustomizations(item.customizations)}
                      </div>
                    )}
                    
                    <div className="flex items-center mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => removeFromCart(item.cartItemId)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 min-w-[1.5rem] text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => addToCart(item, item.customizations)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-auto text-muted-foreground hover:text-destructive"
                        onClick={() => removeItemCompletely(item.cartItemId)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between pt-2 font-semibold text-lg">
                <div>Total:</div>
                <div>${totalPrice}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const OrderForm = ({ cart, placeOrder }) => {
    const [customerInfo, setCustomerInfo] = useState({
      name: '',
      phoneNumber: '',
      note: '',
      paymentMethod: 'cash',
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!customerInfo.name || !customerInfo.phoneNumber) {
        alert('Please provide your name and phone number.');
        return;
      }
      placeOrder(customerInfo);
      setCustomerInfo({
        name: '',
        phoneNumber: '',
        note: '',
        paymentMethod: 'cash',
      });
    };

    return (
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold flex items-center">
            <User className="mr-2 h-5 w-5 text-accent" />
            Customer Information
          </CardTitle>
          <CardDescription>
            Please provide your details to complete the order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="Your phone number"
                  value={customerInfo.phoneNumber}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phoneNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Order Notes (Optional)</Label>
              <Input
                id="note"
                placeholder="Any special instructions"
                value={customerInfo.note}
                onChange={(e) => setCustomerInfo({ ...customerInfo, note: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup
                value={customerInfo.paymentMethod}
                onValueChange={(value) => setCustomerInfo({ ...customerInfo, paymentMethod: value })}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="cursor-pointer">Cash on Pickup</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">Pay with Card</Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={cart.length === 0}
            >
              <Send className="mr-2 h-4 w-4" />
              {cart.length === 0 ? "Add items to place order" : "Place Order"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  const OrderList = ({ orders, deleteOrder, markAsPickedUp }) => {
    const activeOrders = orders.filter((order) => order.status !== 'completed');
    const completedOrders = orders.filter((order) => order.status === 'completed');

    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleString();
    };

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold flex items-center">
            <Clock className="mr-2 h-5 w-5 text-accent" />
            Order Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="active" className="flex items-center justify-center">
                Active ({activeOrders.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center justify-center">
                Completed ({completedOrders.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              {activeOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active orders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="bg-muted pb-2 pt-3">
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="font-semibold">{order.customer.name}</span>
                            <span className="text-xs text-muted-foreground">{formatTimestamp(order.timestamp)}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">${order.totalPrice}</span>
                            <div className="text-xs mt-1">
                              {order.remainingTime > 0 ? (
                                <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground">
                                  Ready in {order.remainingTime} minutes
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                                  Ready for pickup
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="py-3">
                        <div className="text-sm space-y-1.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{item.quantity}x {item.name}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        
                        {order.customer.note && (
                          <div className="mt-3 text-xs bg-secondary p-2 rounded-md">
                            <span className="font-medium">Note:</span> {order.customer.note}
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="flex justify-between space-x-2 pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => deleteOrder(order.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() => markAsPickedUp(order.id)}
                        >
                          <Check className="h-4 w-4 mr-1" /> Picked Up
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {completedOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No completed orders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedOrders.map((order) => (
                    <Card key={order.id} className="overflow-hidden opacity-80">
                      <CardHeader className="pb-2 pt-3">
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="font-semibold">{order.customer.name}</span>
                            <span className="text-xs text-muted-foreground">{formatTimestamp(order.timestamp)}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">${order.totalPrice}</span>
                            <div className="text-xs mt-1">
                              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                Completed
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="py-3">
                        <div className="text-sm space-y-1.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{item.quantity}x {item.name}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-muted-foreground"
                          onClick={() => deleteOrder(order.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Menu addToCart={addToCart} />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Cart 
            cart={cart} 
            removeFromCart={removeFromCart} 
            addToCart={addToCart} 
            removeItemCompletely={removeItemCompletely}
          />
          
          <OrderForm cart={cart} placeOrder={placeOrder} />
          
          <OrderList 
            orders={orders} 
            deleteOrder={deleteOrder} 
            markAsPickedUp={markAsPickedUp} 
          />
        </div>
      </div>
    </div>
  );
}