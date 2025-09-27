import ModuleCard from '../ModuleCard';

export default function ModuleCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <ModuleCard
        title="Peptide Fundamentals"
        description="Learn the basic structure, function, and classification of peptides. Understanding amino acid sequences and their biological roles."
        category="best-sellers"
        duration="45 min"
        difficulty="Beginner"
        isCompleted={true}
        isLocked={false}
        onStart={() => console.log('Peptide Fundamentals started')}
      />
      <ModuleCard
        title="Performance Enhancement Protocols"
        description="Explore peptides for athletic performance, muscle growth, and recovery optimization. Advanced dosing strategies."
        category="performance"
        duration="60 min"
        difficulty="Intermediate"
        isCompleted={false}
        isLocked={false}
        onStart={() => console.log('Performance Enhancement started')}
      />
      <ModuleCard
        title="Advanced Peptide Stacking"
        description="Master complex peptide combinations for synergistic effects. Research-backed protocols for experienced users."
        category="blends"
        duration="90 min"
        difficulty="Advanced"
        isCompleted={false}
        isLocked={true}
        onStart={() => console.log('Advanced Stacking started')}
      />
    </div>
  );
}