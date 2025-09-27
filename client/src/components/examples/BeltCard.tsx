import BeltCard from '../BeltCard';

export default function BeltCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <BeltCard
        beltLevel="white"
        title="White Belt"
        description="Master the fundamentals of peptide science and basic terminology."
        progress={8}
        totalModules={10}
        isUnlocked={true}
        onAdvance={() => console.log('White belt advance clicked')}
      />
      <BeltCard
        beltLevel="red"
        title="Red Belt"
        description="Dive deeper into peptide mechanisms and advanced applications."
        progress={3}
        totalModules={12}
        isUnlocked={true}
        onAdvance={() => console.log('Red belt advance clicked')}
      />
      <BeltCard
        beltLevel="black"
        title="Black Belt"
        description="Master complex peptide protocols and clinical applications."
        progress={0}
        totalModules={15}
        isUnlocked={false}
        onAdvance={() => console.log('Black belt advance clicked')}
      />
      <BeltCard
        beltLevel="gold"
        title="Gold Belt"
        description="Achieve mastery in cutting-edge peptide research and innovation."
        progress={0}
        totalModules={20}
        isUnlocked={false}
        onAdvance={() => console.log('Gold belt advance clicked')}
      />
    </div>
  );
}