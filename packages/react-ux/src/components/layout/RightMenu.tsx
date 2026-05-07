import { useLayout } from '../../hooks/useLayout';

export function RightMenu() {
  const { layoutState, setLayoutState } = useLayout();

  if (!layoutState.rightMenuVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999]"
      onClick={() => setLayoutState({ rightMenuVisible: false })}
    >
      <div
        className="absolute right-0 top-0 h-full w-full sm:w-xl bg-surface-0 dark:bg-surface-900 border-l border-surface shadow-xl overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-emphasis transition-colors"
            onClick={() => setLayoutState({ rightMenuVisible: false })}
          >
            <i className="pi pi-times" />
          </button>
        </div>

        <div>
          <h2 className="title-h7 text-left">Activity</h2>
          <div className="flex flex-col mt-7">
            {[
              { icon: 'pi pi-dollar text-blue-600', title: 'New Sale', description: 'Richard Jones has purchased a blue t-shirt for $79' },
              { icon: 'pi pi-download text-orange-600', title: 'Withdrawal Initiated', description: 'Your request for withdrawal of $2500 has been initiated.' },
              { icon: 'pi pi-question-circle text-violet-600', title: 'Question Received', description: 'Jane Davis has posted a new question about your product.' },
              { icon: 'pi pi-comment text-blue-600', title: 'Comment Received', description: 'Claire Smith has upvoted your store along with a comment.' },
            ].map((activity, idx, arr) => (
              <div key={activity.title} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <span className="w-14 h-14 flex items-center justify-center border border-surface rounded-xl shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]">
                    <i className={`${activity.icon} text-2xl`} />
                  </span>
                  {idx < arr.length - 1 && (
                    <span className="min-h-14 w-px bg-[var(--surface-border)]" />
                  )}
                </div>
                <div className="mt-2">
                  <h5 className="label-large">{activity.title}</h5>
                  <p className="md:label-small mt-1">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
