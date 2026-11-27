import { changeScenario, currentScenario } from './services/mock';
import { scenarios } from './services/scenarios';

export function Component() {
  return <main className="workspace">
    <h1>أدوات الاختبار المحلية</h1>
    <label className="field">حالة الاختبار
      <select defaultValue={currentScenario()} onChange={event => {
        const value = event.currentTarget.value;
        if (Object.hasOwn(scenarios, value)) changeScenario(value as keyof typeof scenarios);
      }}>{Object.entries(scenarios).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
    </label>
    <div className="actions">
      <a className="button" href="/login">تسجيل الدخول</a>
      <a className="button secondary" href="/marketplace/pre-publish">معاينة تجربة السوق</a>
    </div>
  </main>;
}
