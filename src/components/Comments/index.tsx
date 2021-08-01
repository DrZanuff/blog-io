import { useEffect, ReactElement } from 'react';

const commentNodeId = 'comments';

const Comments = (): ReactElement => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
    script.setAttribute('repo', 'DrZanuff/blog-io');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('label', 'comment :speech_balloon:');
    script.setAttribute('theme', 'photon-dark');
    script.setAttribute('crossorigin', 'anonymous');
    const scriptParentNode = document.getElementById(commentNodeId);
    scriptParentNode.appendChild(script);

    return () => {
      scriptParentNode.removeChild(scriptParentNode.firstChild);
    };
  }, []);

  return <div key={String(new Date())} id={commentNodeId} />;
};

export default Comments;
