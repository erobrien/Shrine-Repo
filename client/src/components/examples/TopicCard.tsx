import TopicCard from '../TopicCard';

export default function TopicCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <TopicCard
        title="BPC-157"
        summary="Body Protection Compound-157 shows promise for tissue repair, wound healing, and gastrointestinal protection based on animal studies."
        category="peptide"
        evidenceGrade="B"
        lastUpdated="2 days ago"
        studyCount={47}
        href="/peptides/bpc-157"
        onView={() => console.log('BPC-157 viewed')}
      />
      <TopicCard
        title="Muscle Recovery"
        summary="Various peptides and protocols may support faster muscle recovery after exercise, though human evidence remains limited."
        category="condition"
        evidenceGrade="C"
        lastUpdated="1 week ago"
        studyCount={23}
        href="/conditions/muscle-recovery"
        onView={() => console.log('Muscle Recovery viewed')}
      />
      <TopicCard
        title="Peptide Safety Guidelines"
        summary="Comprehensive guide covering safety considerations, potential side effects, and best practices for peptide use."
        category="guide"
        evidenceGrade="A"
        lastUpdated="3 days ago"
        href="/guides/safety-guidelines"
        onView={() => console.log('Safety Guidelines viewed')}
      />
    </div>
  );
}