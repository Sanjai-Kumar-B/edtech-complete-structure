const fs = require('fs');

const path = 'd:/NXRA/Ed-Tech/edtech-admin/src/pages/LibraryManager.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add Plus icon import
code = code.replace(/import \{ Loader2.*?\} from 'lucide-react';/, `import { Loader2, Search, Link as LinkIcon, FileUp, Filter, Trash2, Edit2, Check, X, Eye, EyeOff, Plus } from 'lucide-react';`);

// 2. Add state variables for batches and modal
const stateVars = `
  const [batches, setBatches] = useState([]);
  const [assigningResource, setAssigningResource] = useState(null);
  const [selectedBatchIds, setSelectedBatchIds] = useState([]);
  const [saving, setSaving] = useState(false);
`;
code = code.replace(/const \[courses, setCourses\] = useState\(\[\]\);/, `const [courses, setCourses] = useState([]);${stateVars}`);

// 3. Update loadResources to fetch batches
code = code.replace(/supabase\.from\('courses'\)\.select\('id, title'\)\.eq\('status', 'active'\)/, `supabase.from('courses').select('id, title').eq('status', 'active'),\n        supabase.from('batches').select('id, batch_code, courses(title)').eq('status', 'active')`);

code = code.replace(/const \[resData, courseData\] = await Promise\.all\(\[/, `const [resData, courseData, batchData] = await Promise.all([`);

code = code.replace(/const loadedCourses = courseData\.data \|\| \[\];\n      setCourses\(loadedCourses\);/, `const loadedCourses = courseData.data || [];\n      setCourses(loadedCourses);\n      if (batchData.error) throw batchData.error;\n      setBatches(batchData.data || []);`);


// 4. Add assignment functions
const assignFuncs = `
  const handleOpenAssignModal = async (resource) => {
    setAssigningResource(resource);
    setSelectedBatchIds([]);
    try {
      const { data, error } = await supabase
        .from('batch_library_resources')
        .select('batch_id')
        .eq('resource_id', resource.id);
      
      if (error) throw error;
      if (data) setSelectedBatchIds(data.map(d => d.batch_id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBatch = (batchId) => {
    if (selectedBatchIds.includes(batchId)) {
      setSelectedBatchIds(selectedBatchIds.filter(id => id !== batchId));
    } else {
      setSelectedBatchIds([...selectedBatchIds, batchId]);
    }
  };

  const handleSaveAssignments = async () => {
    setSaving(true);
    try {
      const { error: delError } = await supabase
        .from('batch_library_resources')
        .delete()
        .eq('resource_id', assigningResource.id);
      if (delError) throw delError;

      if (selectedBatchIds.length > 0) {
        const inserts = selectedBatchIds.map(bId => ({
          batch_id: bId,
          resource_id: assigningResource.id,
          assigned_by: user.id
        }));
        const { error: insError } = await supabase
          .from('batch_library_resources')
          .insert(inserts);
        if (insError) throw insError;
      }
      setAssigningResource(null);
    } catch (err) {
      alert("Failed to save assignments: " + err.message);
    } finally {
      setSaving(false);
    }
  };
`;
code = code.replace(/const handleFileChange = \(e\) => \{/, `${assignFuncs}\n  const handleFileChange = (e) => {`);

// 5. Add Assign button in the table actions
code = code.replace(/<button onClick=\{\(\) => startEditing\(r\)\}/, `<button onClick={() => handleOpenAssignModal(r)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md" title="Assign to Batches"><Plus size={16} /></button>\n                          <button onClick={() => startEditing(r)}`);


// 6. Add the Modal JSX right before the last closing div
const modalJSX = `
      {/* ASSIGN MODAL */}
      {assigningResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Assign Resource</h3>
                <p className="text-sm text-slate-500 truncate max-w-[250px]">{assigningResource.title}</p>
              </div>
              <button onClick={() => setAssigningResource(null)} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100">
                <X size={18}/>
              </button>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 mb-6">
              {batches.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No active batches available.</p>
              ) : (
                batches.map(batch => (
                  <label key={batch.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:border-indigo-200 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={selectedBatchIds.includes(batch.id)}
                      onChange={() => handleToggleBatch(batch.id)}
                      className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-800">{batch.batch_code}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{batch.courses?.title || 'Unknown Course'}</div>
                    </div>
                  </label>
                ))
              )}
            </div>

            <button 
              onClick={handleSaveAssignments}
              disabled={saving || batches.length === 0}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : 'Save Assignments'}
            </button>
          </div>
        </div>
      )}
`;

code = code.replace(/    <\/div>\n  \);\n\}\n/, `${modalJSX}    </div>\n  );\n}\n`);

fs.writeFileSync(path, code, 'utf8');
console.log('Updated Admin LibraryManager.jsx');
