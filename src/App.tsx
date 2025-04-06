import { Button } from './design-system/ui/Button.tsx';
import { Text } from './design-system/ui/Text.tsx';

function App() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col gap-xl">
        <Button>Click me</Button>
        <Text variant="headline-xl">Hello World</Text>
      </div>
    </div>
  );
}

export default App;
