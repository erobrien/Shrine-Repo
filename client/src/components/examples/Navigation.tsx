import Navigation from '../Navigation';

export default function NavigationExample() {
  return (
    <Navigation 
      onLoginClick={() => console.log('Begin Your Training clicked')}
    />
  );
}