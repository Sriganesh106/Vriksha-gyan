'use client';

import { useState } from 'react';
import { db, doc, setDoc, collection, query, orderBy, limit, onSnapshot, serverTimestamp } from '../lib/firebase';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function FirebaseTest() {
  const [status, setStatus] = useState<string>('Not tested');
  const [testData, setTestData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testFirebaseConnection = async () => {
    setLoading(true);
    setStatus('Testing...');
    
    try {
      // Test 1: Write data to Realtime Database
      const testDocId = `test-${Date.now()}`;
      await setDoc(doc(db, 'firebase-test', testDocId), {
        message: 'Realtime Database connection test',
        timestamp: Date.now(),
        testId: testDocId
      });
      
      setStatus('✅ Write test passed');
      
      // Test 2: Read data from Realtime Database
      const testRef = collection(db, 'firebase-test');
      
      const unsubscribe = onSnapshot(testRef, (snapshot: any) => {
        const data: any[] = [];
        snapshot.forEach((item: any) => {
          data.push(item);
        });
        setTestData(data.slice(0, 5)); // Show last 5 entries
        setStatus('✅ Realtime Database is working! Read/Write successful');
        setLoading(false);
      }, (error: any) => {
        console.error('Firebase read error:', error);
        setStatus(`❌ Read failed: ${error.message}`);
        setLoading(false);
      });
      
      // Cleanup listener after 5 seconds
      setTimeout(() => unsubscribe(), 5000);
      
    } catch (error: any) {
      console.error('Firebase test error:', error);
      setStatus(`❌ Firebase error: ${error.message}`);
      setLoading(false);
    }
  };

  const testQuizScore = async () => {
    setLoading(true);
    try {
      // Simulate saving a quiz score (same as QuizGame component)
      const docId = `test-user-${Date.now()}`;
      await setDoc(doc(db, 'scores', docId), {
        userName: 'Test User',
        score: 85,
        totalQuestions: 10,
        correctAnswers: 8,
        timestamp: Date.now()
      });
      
      setStatus('✅ Quiz score test successful! Check your Realtime Database');
      setLoading(false);
    } catch (error: any) {
      setStatus(`❌ Quiz score test failed: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🔥 Firebase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testFirebaseConnection} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Testing...' : 'Test Firebase Connection'}
          </Button>
          
          <Button 
            onClick={testQuizScore} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Testing...' : 'Test Quiz Score Save'}
          </Button>
        </div>
        
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="font-semibold">Status:</p>
          <p className={`${status.includes('✅') ? 'text-green-600' : status.includes('❌') ? 'text-red-600' : 'text-gray-600'}`}>
            {status}
          </p>
        </div>
        
        {testData.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="font-semibold mb-2">Recent Test Data:</p>
            {testData.map((item, index) => (
              <div key={item.id} className="text-sm mb-1">
                {index + 1}. {item.message} - {item.testId}
              </div>
            ))}
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p><strong>What this tests:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Firebase connection and authentication</li>
            <li>Firestore write operations (setDoc)</li>
            <li>Firestore read operations (onSnapshot)</li>
            <li>Real-time data updates</li>
            <li>Quiz score saving functionality</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
