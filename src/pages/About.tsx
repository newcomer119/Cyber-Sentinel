export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About CollegeCTF</h1>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">What is CTF?</h2>
          <p className="text-gray-600">
            Capture The Flag (CTF) is a cybersecurity competition where participants solve security challenges
            to find hidden flags. These challenges test various skills including cryptography,
            web exploitation, reverse engineering, and more.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Participate</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Create an account or sign in if you already have one</li>
            <li>Navigate to the Compete section</li>
            <li>Choose a challenge to attempt</li>
            <li>Find the flag in the format CTF{'{'}<span>flag_text</span>{'}'}</li>
            <li>Submit your flag to score points</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rules</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Each challenge has a time limit</li>
            <li>Sharing flags is strictly prohibited</li>
            <li>Attacking the CTF infrastructure is not allowed</li>
            <li>Have fun and learn!</li>
          </ul>
        </section>
      </div>
    </div>
  );
}